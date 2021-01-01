export default class Assert {
  static isTrue(condition: boolean, error: string|(()=>string)) { 
    if (!condition) throw new Error(typeof(error) === 'string' ? error : error()); 
  }
} 
