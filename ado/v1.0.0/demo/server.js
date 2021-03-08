const ADO = require('./index');
let local = {
    user: [
        {
            username: '张三',
            password: '123',
            sex: 1,
            beginDate: '2021-01-01',
            endDate: '2021-01-30',
        }
    ]
}


export default new ADO(local);