module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': { // 自动转换px->rem
      rootValue: 75, // html的font-size大小
      propList: ['*'] // 哪些属性可以从px更改到rem，一般都是所有属性
    }
  }
}
