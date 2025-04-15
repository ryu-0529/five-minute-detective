/**
 * 共通ユーティリティ関数
 */

// クライアントサイドかどうかを判定する
export const isClient = typeof window !== 'undefined';

// 文字列をスラッグ（URL用の文字列）に変換する
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')       // スペースをハイフンに置換
    .replace(/[^\w\-]+/g, '')   // 英数字とハイフン以外を削除
    .replace(/\-\-+/g, '-')     // 連続するハイフンを単一のハイフンに置換
    .replace(/^-+/, '')         // 先頭のハイフンを削除
    .replace(/-+$/, '');        // 末尾のハイフンを削除
};

// ランダムなIDを生成する
export const generateId = (length: number = 8): string => {
  return Math.random().toString(36).substring(2, 2 + length);
};

// 配列をシャッフルする
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// オブジェクトの深いコピーを作成する
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  const clonedObj = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  
  return clonedObj;
};

// ディープマージ - 2つのオブジェクトを再帰的にマージする
export const deepMerge = <T>(target: T, source: Partial<T>): T => {
  const output = { ...target } as { [key: string]: any };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output as T;
};

// オブジェクトかどうかを判定するヘルパー関数
const isObject = (item: any): boolean => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

// デバウンス関数（連続した呼び出しを間引く）
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
};

// スロットル関数（一定時間ごとに処理を実行する）
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};
