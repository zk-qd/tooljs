
import ado from "./server";

// 建表
const schema = ado.schema({
    username: { type: String },
    password: { type: String },
    sex: { type: Number },
    beginDate: { type: String, begin: true },
    endDate: { type: String, end: true },
}),
    // 创建数据模型
    model = ado.model('user', schema);




export function page() {
    return model.search({
        username: '李四',
        index: 1,
        count: 10,
    })
}


export function insert() {
    return model.insert({
        username: '李四',
        password: '123',
        sex: 1,
        beginDate: '2021-01-01',
        endDate: '2021-01-30',
    });
}

export function find() {
    return model.find({
        beginDate: '2021-01-01',
        endDate: '2021-01-30',
    })
}

export function update() {
    return model.update('id值', {
        beginDate: '2021-01-01',
        endDate: '2021-01-30',
    })
}

export function del() {
    return model.delete('id值')
}
