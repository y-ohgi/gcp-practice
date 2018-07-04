const Spanner = require('@google-cloud/spanner')

const ENV = process.env

const database = () => {
  const spanner = Spanner({
    projectId: ENV.PROJECT_ID
  })

  const instance = spanner.instance(ENV.INSTANCE_ID)
  return instance.database(ENV.DATABASE_ID)
}

const tables = table => {
  return database().table(table)
}

// FIXME: idは生成方法変更を加味してここで挿入したいが、インターリーブが微妙
const insert = (table, values) => new Promise(
  (resolve, reject) => {
    const vals = values.map(elm => {
      elm['created_at'] = new Date()
      return elm
    })

    tables(table)
      .insert(vals)
      .then(() => resolve(vals))
      .catch(err => {
        console.log(err)
        reject(err)
      })
      .then(result => database().close())
  }
)

const select = (table, columns) => new Promise(
  (resolve, reject) => {
    const query = {
      keySet: {
        all: true
      },
      columns: columns
    }

    tables(table)
      .read(query)
      .then(res => resolve(res))
      .catch(err => {
        console.log(err)
        reject(err)
      })
      .then(result => database().close())
  }
)

// TODO: インデックスは明示的に指定しなければならないっぽいので、する。
//  => https://cloud.google.com/spanner/docs/getting-started/nodejs/#read_using_the_index
// FIXME: targetIdがダサめ
const find = (table, columns, id, targetId = null) => new Promise(
  (resolve, reject) => {
    const target = targetId || columns.filter(col => col.match('_id$'))
    const cols = columns.join(',')

    const query = {
      sql: `SELECT ${cols} FROM ${table} WHERE ${target} = @id`,
      params: {
        id: id
      }
    }

    console.log(query)

    database()
      .run(query)
      .then(res => resolve(res[0]))
      .catch(err => {
        console.log(err)
        reject(err)
      })
      .then(result => database().close())
  }
)

module.exports = {
  insert,
  select,
  find
}
