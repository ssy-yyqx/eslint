// 自定义校验方法
// 中文名
const cnNameReg = /^[\u4e00-\u9fa5a-zA-Z0-9][\u4e00-\u9fa5\w\-.()（）]*$/
const cnNameMessage = '中英文或数字开头,支持特殊字符._-()'
// 英文名
const enNameReg = /^[a-zA-Z0-9][\w\-.()]*$/
const enNameMessage = '英文或数字开头,支持特殊字符._-()'
// 手机
const phoneReg = /^1\d{10}$/
// 身份证
const identityReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|x)$)/
// 银行卡号
const bankIdReg = /^([1-9]{1})(\d{15}|\d{18})$/


// 金额
const moneyReg = /^-?(([1-9]\d*)|0)(\.\d{1,3})?$/
// 密码
const passwordReg = /^[a-zA-Z0-9]{8,30}$/
// integer
const intReg = /^(-?[1-9]\d{0,10})$|^0$/
// float
const floatReg = /^-?(([1-9]\d{0,13})|0)(\.\d{0,5}[1-9])?$/
// array
const arrayReg = /^.+(,.+)*$/
// naturalNum
const natureNumReg = /^[1-9]\d*$/

// 只能输入小数.整数部分不超过8位，小数部分不不超过4位
const decimalReg = /^\d{1,8}\.\d{1,4}?$/




// 密码校验
export function $rPassword(rule, value, callback) {
  if (value) {
    if (passwordReg.test(value)) {
      let level = 0
      if (/[a-z]/.test(value)) {
        level++
      }
      if (/[A-Z]/.test(value)) {
        level++
      }
      if (/\d/.test(value)) {
        level++
      }
      if (level < 3) {
        callback(new Error('密码必须有大小写字母数字'))
      } else {
        callback()
      }
    } else {
      callback(new Error('密码仅支持大小写字母数字,长度8~30'))
    }
  } else {
    callback(new Error('不能为空'))
  }
}

// 必填校验 支持 字符串数组
export function $rRequired({ label, placeholder, trigger, form = 'form' }) {
  return {
    validator: (rule, value, callback) => {
      setTimeout(() => {
        value = this[form] ? this[form][rule.field] : value
        if ((value instanceof Array && !value.length) || !value) {
          callback(new Error(placeholder || (label || '') + '不能为空'))
        } else {
          callback()
        }
      }, 0)
    },
    trigger
  }
}

// 邮箱校验
export function $rEmail() {
  return { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
}

// 中文校验
export function $rChinese() {
  return { pattern: cnNameReg, message: cnNameMessage, trigger: 'blur' }
}

// 英文校验
export function $rEnglish() {
  return { pattern: enNameReg, message: enNameMessage, trigger: 'blur' }
}

// 金额校验
export function $rMoney() {
  return { pattern: moneyReg, message: '金额格式不正确，只需精确到厘', trigger: 'blur' }
}

// 身份证校验
export function $rIdentity() {
  return { pattern: identityReg, message: '身份证号码格式不正确，若有x请小写', trigger: 'blur' }
}

// 手机校验
export function $rPhone() {
  return { pattern: phoneReg, message: '手机号格式不正确', trigger: 'blur' }
}

// 银行卡校验
export function $rBankId() {
  return { pattern: bankIdReg, message: '银行卡号不正确', trigger: 'blur' }
}

// 英文名校验
export function $rEnName({ label, checkApi, placeholder, form = 'form', required = true }) {
  let rules = [
    { required, message: placeholder, trigger: 'blur' },
    { pattern: enNameReg, message: enNameMessage, trigger: 'blur' }
  ]
  if (checkApi) {
    rules.push({
      validator: (rule, value, callback) => {
        this.$http
          .post(checkApi, {
            id: this[form].id,
            [rule.field]: value
          })
          .then(
            res => {
              if (res.code === this.$root.codeSuccess) {
                callback()
              } else {
                callback(new Error(label + '重复'))
              }
            },
            () => {
              callback(new Error(label + '重复'))
            }
          )
      },
      trigger: 'blur'
    })
  }
  return rules
}

// 中文名校验
export function $rCnName({ label, checkApi, placeholder, form = 'form' }) {
  let rules = [
    { required: true, message: placeholder, trigger: 'blur' },
    { pattern: cnNameReg, message: cnNameMessage, trigger: 'blur' }
  ]
  if (checkApi) {
    rules.push({
      validator: (rule, value, callback) => {
        let data = {
          id: this[form].id,
          [rule.field]: value
        }
        // 创建编辑组织
        if (rule.field === 'branchName') {
          data.branchFId = this[form].branchFId
          if (!this[form].branchFId) {
            return callback()
          }
        }
        // 创建编辑角色
        if (rule.field === 'roleName') {
          data.branchId = this[form].branchId
          if (!this[form].branchId) {
            return callback()
          }
        }
        this.$http.post(checkApi, data).then(
          res => {
            if (res.code === this.$root.codeSuccess) {
              callback()
            } else {
              callback(new Error(label + '重复'))
            }
          },
          () => {
            callback(new Error(label + '重复'))
          }
        )
      },
      trigger: 'blur'
    })
  }
  return rules
}

// 描述校验
export function $rDesc() {
  return [
    { required: false, message: '', trigger: 'blur' },
    { min: 0, max: 100, message: '最多100个字符', trigger: 'blur' }
  ]
}

// integer类型校验
export function $rInteger() {
  return { pattern: intReg, message: '格式为整数', trigger: 'blur' }
}

// float
export function $rFloat() {
  return { pattern: floatReg, message: '格式为数值', trigger: 'blur' }
}

// decimal
export function $rDecimal(){
  return { pattern: decimalReg, message: '格式为小数', trigger: 'blur' }
}

// array类型校验
export function $rArray() {
  return { pattern: arrayReg, message: '格式为array如: a,b,c', trigger: 'blur' }
}

// natureNum正整数校验
export function $rNatureNum() {
  return { pattern: natureNumReg, message: '格式为正整数', trigger: 'blur' }
}
