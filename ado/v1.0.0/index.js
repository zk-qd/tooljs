/**
 * @todo 依赖：$math $array
 */

(function(global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document
      ? (function() {
          return (window.$ado = factory(global));
        })()
      : factory(global);
  } else {
    window.$ado = factory(global);
  }
})(typeof window !== "undefined" ? window : this, function(window) {
  // 字段匹配模型
  const fieldPattern = new Map([
    [
      Number,
      {
        filter(table, params, field) {
          return table.filter((item) => item[field] === params[field]);
        },
      },
    ],
    [
      String,
      {
        filter(table, params, field) {
          return table.filter((item) => item[field] === params[field].trim());
        },
        fuzzy: {
          filter(table, params, field) {
            return table.filter((item) =>
              item[field].includes(params[field].trim())
            );
          },
        },
      },
    ],
    [
      Boolean,
      {
        filter(table, params, field) {
          return table.filter((item) => item[field] === params[field]);
        },
      },
    ],
    [
      Date,
      {
        begin: {
          filter(table, params, field) {
            return table.filter(
              (item) =>
                new Date(item[field]).getTime() >=
                new Date(params[field]).getTime()
            );
          },
        },
        end: {
          filter(table, params, field) {
            return table.filter(
              (item) =>
                new Date(item[field]).getTime() <=
                new Date(params[field]).getTime()
            );
          },
        },
        filter(table, params, field) {
          return table.filter(
            (item) =>
              new Date(item[field]).getTime() ===
              new Date(params[field]).getTime()
          );
        },
      },
    ],
  ]);

  /**
   *
   * @param {*} local 数据
   * @param {*} identifier 唯一标识名称
   * @property local
   * @property identifier
   * @method schema 创建表
   * @method model 创建模型
   */
  function ADO(local, identifier = "id") {
    this.local = new Map();
    this.identifier = identifier;
    // 生成随机id
    for (let name in local) {
      this.local.set(
        name,
        local[name].map((item, index) => {
          item[identifier] = $math.random() /*  index */;
          return item;
        })
      );
    }
  }

  ADO.prototype = {
    // 字段和类型
    // index = { type: Number },
    // count = { type: Number },
    // string = { type: String, fuzzy: true },
    // boolean = { type: Boolean },
    // data = { type: Date, begin: true },
    // data = { type: Date, end: true },
    schema(config) {
      // 枚举对象
      for (let field in config) {
        let item = config[field];
        if (item.type === String && item.fuzzy) {
          item.filter = fieldPattern.get(item.type)["fuzzy"].filter;
        } else if (item.type === Date && item.begin) {
          item.filter = fieldPattern.get(item.type)["begin"].filter;
        } else if (item.type === Date && item.end) {
          item.filter = fieldPattern.get(item.type)["end"].filter;
        } else {
          item.filter = fieldPattern.get(item.type).filter;
        }
      }
      // 思路： 通过枚举config对象，匹配各类筛选方法
      return config;
    },
    model(name, schema) {
      let table = this.local.get(name),
        that = this;
      // 安全处理
      if (!table) throw Error(`请检查${name}这张表数据是否有添加到数据库中`);
      return {
        search(params) {
          let index = params.index,
            count = params.count,
            limit = (index - 1) * count;
          // 删除index和count
          // Reflect.deleteProperty(params, 'index');
          // Reflect.deleteProperty(params, 'count');
          // 参数筛选
          let result = this.findMany(params),
            // 总条数
            rows = result.length;
          // 分页筛选
          result = result.slice(limit, limit + count);
          return Promise.resolve({
            code: 200,
            msg: "处理成功",
            data: {
              datas: result,
              index: index,
              count: count,
              rows: rows,
            },
          });
        },
        insert(data) {
          let result = local.push(...$array.toArray(data));
          // let result = table.push(data);
          return Promise.resolve({
            code: 200,
            msg: "新增成功",
            data: result,
          });
        },
        find(params) {
          let result = this.findMany(params);
          return Promise.resolve({
            code: 200,
            msg: "处理成功",
            data: result[0],
          });
        },
        findMany(params) {
          let fields = Object.keys(params);
          let result = fields.reduce((table, field) => {
            if (schema[field])
              return schema[field].filter(table, params, field);
            else return table;
          }, table);
          return result;
        },
        update(id, params) {
          let index = table.findIndex((item) => item[that.identifier] === id),
            result = Object.assign(table[index], params);
          return Promise.resolve({
            code: 200,
            msg: "修改成功",
            data: result,
          });
        },
        delete(id) {
          let index = table.findIndex((item) => item[that.identifier] === id),
            result = table.splice(index, 1);
          return Promise.resolve({
            code: 200,
            msg: "删除成功",
            data: result,
          });
        },
      };
    },
  };
  return ADO;
});
