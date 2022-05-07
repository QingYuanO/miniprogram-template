export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

//是否是有效的url链接
export const isUrlLink = (url:string) => {
  const rep =
    /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
  return rep.test(url);
};
export const isPhoneNumber = (phone:string) => {
  const phoneReg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
  return phoneReg.test(phone);
};

export const isIdCard = (idcard:string) => {
  const idcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idcardReg.test(idcard);
};

export const isEmail = (email:string) => {
  const emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return emailReg.test(email);
};

