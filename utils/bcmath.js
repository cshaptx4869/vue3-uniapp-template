/**
 * 提供精确的加减乘除和取模运算，解决浮点数精度问题
 * 主要思路是将浮点数先乘以一定的数值转换为整数，通过整数进行运算，然后将结果除以相同的数值转换成浮点数后返回
 */
export const BCMath = {
  /**
   * 处理传入参数，统一转换为数组格式
   * @param args 可以是数字、数字数组
   * @returns 扁平化后的数字数组
   */
  getParam(args) {
    return Array.prototype.concat.apply([], args);
  },
  /**
   * 计算单个数字的乘数因子
   * 1.首先判断是否有小数点，如果没有，则返回1；
   * 2.有小数点时，将小数位数的长度作为Math.pow()函数的参数进行计算
   * 例如2的乘数因子为1，2.01的乘数因子为100
   * @param x 需要计算的数字
   * @returns 乘数因子 (10 的小数位数次方)
   */
  multiplier(x) {
    let parts = x.toString().split(".");
    return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
  },
  /**
   * 计算多个数字的最大乘数因子
   * 例如1.3的乘数因子为10，2.13的乘数因子为100，则1.3和2.13的最大乘数因子为100
   * @param numbers 需要计算的数字数组
   * @returns 最大的乘数因子
   */
  correctionFactor(argArr) {
    return argArr.reduce((accum, next) => {
      let num = this.multiplier(next);
      return Math.max(accum, num);
    }, 1);
  },
  /**
   * 精确加法运算
   * @param args 多个数字或数字数组
   * @returns 精确相加后的结果
   */
  add(...args) {
    const calArr = this.getParam(args);
    const corrFactor = this.correctionFactor(calArr);
    const sum = calArr.reduce((accum, curr) => {
      return accum + Math.round(curr * corrFactor);
    }, 0);
    return sum / corrFactor;
  },
  /**
   * 精确减法运算
   * @param args 多个数字或数字数组
   * @returns 精确相减后的结果
   */
  sub(...args) {
    const calArr = this.getParam(args);
    const corrFactor = this.correctionFactor(calArr);
    const difference = calArr.reduce((accum, curr, curIndex) => {
      // reduce()函数在未传入初始值时，accum初始化为数组中的第一个值，curr初始化为数组中的第二个值，curIndex从1开始
      if (curIndex === 1) {
        return Math.round(accum * corrFactor) - Math.round(curr * corrFactor);
      }
      // accum作为上一次运算的结果，就无须再乘以最大因子
      return Math.round(accum) - Math.round(curr * corrFactor);
    });
    return difference / corrFactor;
  },
  /**
   * 精确乘法运算
   * @param args 多个数字或数字数组
   * @returns 精确相乘后的结果
   */
  mul(...args) {
    const calArr = this.getParam(args);
    const corrFactor = this.correctionFactor(calArr);
    const product = calArr
      .map((item) => item * corrFactor)
      .reduce((accum, curr) => {
        return Math.round(accum) * Math.round(curr);
      }, 1);
    return product / Math.pow(corrFactor, calArr.length);
  },
  /**
   * 精确除法运算
   * @param args 多个数字或数字数组
   * @returns 精确相除后的结果
   */
  div(...args) {
    const calArr = this.getParam(args);
    const quotient = calArr.reduce((accum, curr) => {
      const corrFactor = this.correctionFactor([accum, curr]);
      return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
    });
    return quotient;
  },
  /**
   * 精确取模运算
   * @param args 多个数字或数字数组
   * @returns 精确取模后的结果
   */
  mod(...args) {
    const calArr = this.getParam(args);
    const remainder = calArr.reduce((accum, curr) => {
      const corrFactor = this.correctionFactor([accum, curr]);
      return (
        (Math.round(accum * corrFactor) % Math.round(curr * corrFactor)) /
        corrFactor
      );
    });
    return remainder;
  },
};

export default BCMath;
