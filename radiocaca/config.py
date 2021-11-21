# 邮箱服务商映射
SMTP_TYPE_MAPPING = {
    "163": dict(host="smtp.163.com", port=465),
    "qq": dict(host="smtp.qq.com", port=465)
}

# SMTP服务发送邮件的用户  PS: 配置163服务的时候需要加入自己的邮件地址，负责会被认为是垃圾邮件
SMTP_TO_USERS = ("fishz@qq.com", "rmwj0301@163.com", "lgy1159@163.com", "l1m310629@gmail.com", "Coindotup@163.com",
                 "hikariz@126.com", "546759734@qq.com", "19975398996@163.com", "ajhsdgka@163.com")

# SMTP 配置  user 用户邮件地址  pwd SMTP服务授权码（不是密码）  svr_type 服务商类型 qq or 163 ...
SMTP_CONFIGS = (
    dict(user="19975398996@163.com", pwd="RPVEKXTFXEMRZFHV", svr_type="163"),
    dict(user="ajhsdgka@163.com", pwd="DWHEACASQTCJXAGU", svr_type="163"),
)