import { useEffect, useRef, useCallback } from 'react';

/**
 * ゲーム内のサウンドを管理するカスタムフック
 * @param {Object} options - オプション設定
 * @param {boolean} options.enabled - サウンドを有効にするかどうか
 */
const useSound = (options = { enabled: true }) => {
  // サウンドの有効状態
  const enabled = useRef(options.enabled);
  
  // オーディオ要素のキャッシュ
  const audioCache = useRef({});
  
  // 音量設定（0.0〜1.0）
  const volume = useRef(0.5);
  
  // BGMの状態管理
  const currentBgm = useRef(null);
  
  // Howlerライブラリが読み込まれたかどうか
  const howlerLoaded = useRef(false);

  // Howlerライブラリの読み込み（遅延ロード）
  useEffect(() => {
    if (!howlerLoaded.current && typeof window !== 'undefined') {
      const loadHowler = async () => {
        try {
          const { Howl, Howler } = await import('howler');
          window.Howl = Howl;
          window.Howler = Howler;
          howlerLoaded.current = true;
        } catch (err) {
          console.error('Howlerの読み込みに失敗しました:', err);
        }
      };
      
      loadHowler();
    }
    
    // クリーンアップ時に全てのサウンドを停止
    return () => {
      if (window.Howler) {
        window.Howler.stop();
      }
      
      // キャッシュしたすべてのオーディオを停止
      Object.values(audioCache.current).forEach(audio => {
        if (audio && audio.stop) {
          audio.stop();
        }
      });
    };
  }, []);

  // サウンド有効状態の切り替え
  const toggleSound = useCallback(() => {
    enabled.current = !enabled.current;
    
    // 全体の音量制御
    if (window.Howler) {
      window.Howler.mute(!enabled.current);
    }
    
    return enabled.current;
  }, []);

  // 音量設定
  const setVolume = useCallback((newVolume) => {
    // 0.0〜1.0の範囲に制限
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    volume.current = clampedVolume;
    
    // 全体の音量を設定
    if (window.Howler) {
      window.Howler.volume(clampedVolume);
    }
    
    return clampedVolume;
  }, []);

  // 効果音の再生
  const playSfx = useCallback((soundId, options = {}) => {
    if (!enabled.current || !window.Howl) return;
    
    const { volume: soundVolume = volume.current, loop = false, onEnd } = options;
    
    try {
      // キャッシュにあればそれを使用
      if (audioCache.current[soundId]) {
        const sound = audioCache.current[soundId];
        sound.volume(soundVolume);
        sound.loop(loop);
        if (onEnd) sound.on('end', onEnd);
        sound.play();
        return sound;
      }
      
      // 新規サウンドの作成
      const sound = new window.Howl({
        src: [`/sounds/${soundId}.mp3`, `/sounds/${soundId}.webm`],
        volume: soundVolume,
        loop,
        onend: onEnd
      });
      
      // キャッシュに保存
      audioCache.current[soundId] = sound;
      sound.play();
      return sound;
    } catch (err) {
      console.error(`効果音「${soundId}」の再生に失敗しました:`, err);
      return null;
    }
  }, []);

  // BGMの再生
  const playBgm = useCallback((musicId, options = {}) => {
    if (!enabled.current || !window.Howl) return;
    
    const { 
      volume: musicVolume = volume.current * 0.7, // BGMは若干小さめにするのが一般的
      fadeIn = 1000, // フェードイン時間（ミリ秒）
      loop = true
    } = options;
    
    try {
      // 現在のBGMを停止
      if (currentBgm.current) {
        currentBgm.current.fade(currentBgm.current.volume(), 0, 500);
        setTimeout(() => {
          currentBgm.current.stop();
        }, 500);
      }
      
      // 新しいBGMの作成または取得
      let music;
      if (audioCache.current[`bgm_${musicId}`]) {
        music = audioCache.current[`bgm_${musicId}`];
        music.volume(0);
      } else {
        music = new window.Howl({
          src: [`/sounds/bgm/${musicId}.mp3`, `/sounds/bgm/${musicId}.webm`],
          volume: 0,
          loop
        });
        audioCache.current[`bgm_${musicId}`] = music;
      }
      
      // 再生開始とフェードイン
      music.play();
      music.fade(0, musicVolume, fadeIn);
      currentBgm.current = music;
      
      return music;
    } catch (err) {
      console.error(`BGM「${musicId}」の再生に失敗しました:`, err);
      return null;
    }
  }, []);

  // BGMの停止
  const stopBgm = useCallback((fadeOut = 1000) => {
    if (!currentBgm.current) return;
    
    const music = currentBgm.current;
    music.fade(music.volume(), 0, fadeOut);
    
    setTimeout(() => {
      music.stop();
      if (currentBgm.current === music) {
        currentBgm.current = null;
      }
    }, fadeOut);
  }, []);

  // すべてのサウンドをプリロード
  const preloadSounds = useCallback((soundIds = []) => {
    if (!window.Howl) return;
    
    soundIds.forEach(id => {
      // 既にキャッシュにあればスキップ
      if (audioCache.current[id]) return;
      
      const sound = new window.Howl({
        src: [`/sounds/${id}.mp3`, `/sounds/${id}.webm`],
        preload: true
      });
      
      audioCache.current[id] = sound;
    });
  }, []);

  // BGMをプリロード
  const preloadBgm = useCallback((musicIds = []) => {
    if (!window.Howl) return;
    
    musicIds.forEach(id => {
      const cacheKey = `bgm_${id}`;
      // 既にキャッシュにあればスキップ
      if (audioCache.current[cacheKey]) return;
      
      const music = new window.Howl({
        src: [`/sounds/bgm/${id}.mp3`, `/sounds/bgm/${id}.webm`],
        preload: true
      });
      
      audioCache.current[cacheKey] = music;
    });
  }, []);

  return {
    isEnabled: () => enabled.current,
    toggleSound,
    getVolume: () => volume.current,
    setVolume,
    playSfx,
    playBgm,
    stopBgm,
    preloadSounds,
    preloadBgm
  };
};

export default useSound;
