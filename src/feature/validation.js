import badword from "../constants/badword.js";

/**
 * 문자열의 길이가 주어진 범위 내에 있는지 확인하는 함수
 */
export const checkStringLength = (str, a, b = Infinity, name = "입력값") => {
  const { length } = str;
  if (length >= a && length <= b) return { res: true };
  return {
    res: false,
    msg:
      a === b
        ? `${name}의 길이는 ${a}자입니다.`
        : `${name}의 길이는${a > 0 ? ` 최소 ${a}자` : ""}${b === Infinity ? "" : ` 최대 ${b}자`}입니다.`
  };
};

/**
 * 문자열이 초성과 공백만으로 구성되어 있는지 확인하는 함수
 */
export const checkOnlyFirstConsonant = (str, name = "입력값") => {
  if (!/^[\u3131-\u314E\s]+$/.test(str)) return { res: true };
  return { res: false, msg: `${name}이 초성과 공백으로만 이루어져 있습니다.` };
};

/**
 * 문자열이 숫자만으로 구성되어 있는지 확인하는 함수
 */
export const checkOnlyDigits = (str, name = "입력값") => {
  if (/^(?:\d+|)$/.test(str)) return { res: true };
  return { res: false, msg: `${name}은 숫자로만 이루어져야 합니다.` };
};

/////////////////////////////

/**
 * 리뷰 작성자 이름 유효성 검사
 */
export const validateId = (idValue, savedReviews) => {
  const lengthVal = checkStringLength(idValue, 3, 7, "ID");
  if (!lengthVal.res) {
    alert(lengthVal.msg);
    return false;
  }
  for (let i = 0; i < savedReviews.length; i++) {
    if (idValue === savedReviews[i].id) {
      alert("중복된 ID입니다.");
      return false;
    }
  }
  for (let i = 0; i < badword.length; i++) {
    if (idValue.includes(badword[i])) {
      alert("ID에 비속어가 포함 되어 있습니다.");
      return false;
    }
  }
  return true;
};

/**
 * 리뷰 비밀번호 유효성 검사
 */
export const validatePassword = (passwordValue) => {
  const lengthVal = checkStringLength(passwordValue, 4, 4, "PW");
  if (!lengthVal.res) {
    alert(lengthVal.msg);
    return false;
  }
  const digitVal = checkOnlyDigits(passwordValue, "PW");
  if (!digitVal.res) {
    alert(digitVal.msg);
    return false;
  }
  return true;
};

/**
 * 리뷰 내용 유효성 검사
 */
export const validateReview = (reviewValue) => {
  const lengthVal = checkStringLength(reviewValue, 5, 100, "관람평");
  if (!lengthVal.res) {
    alert(lengthVal.msg);
    return false;
  }
  const consonVal = checkOnlyFirstConsonant(reviewValue, "관람평");
  if (!consonVal.res) {
    alert(consonVal.msg);
    return false;
  }
  for (let i = 0; i < badword.length; i++) {
    if (reviewValue.includes(badword[i])) {
      alert("관람평에 비속어가 포함 되어 있습니다.");
      return false;
    }
  }
  return true;
};
