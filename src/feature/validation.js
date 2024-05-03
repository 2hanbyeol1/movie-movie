/**
 * 문자열의 길이가 주어진 범위 내에 있는지 확인하는 함수
 */
export const checkStringLength = (str, a, b = Infinity) => {
  const { length } = str;
  if (length >= a && length <= b) return { res: true };
  return {
    res: false,
    msg: `입력값의 길이는${a > 0 ? ` 최소 ${a}자` : ""}${b === Infinity ? "" : ` 최대 ${b}자`}입니다.`
  };
};

/**
 * 문자열이 초성과 공백만으로 구성되어 있는지 확인하는 함수
 */
export const checkOnlyFirstConsonant = (str) => {
  if (!/^[\u3131-\u314E\s]+$/.test(str)) return { res: true };
  return { res: false, msg: "입력값이 초성과 공백으로만 이루어져 있습니다." };
};

/**
 * 문자열이 숫자만으로 구성되어 있는지 확인하는 함수
 */
export const checkOnlyDigits = (str) => {
  if (/^(?:\d+|)$/.test(str)) return { res: true };
  return { res: false, msg: "입력값은 숫자로만 이루어져야 합니다." };
};
