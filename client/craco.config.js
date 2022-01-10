module.exports = {
  babel: {
    plugins: [
      [
        "module-resolver", {
          root: ["./src"]
        }
      ]
    ]
  },
  eslint: {
    configure: {
      rules: {
        "import/no-anonymous-default-export": ["off", {
          allowArray: true,
          allowArrowFunction: true,
          allowAnonymousClass: true,
          allowAnonymousFunction: true,
          allowCallExpression: true,
          allowLiteral: true,
          allowObject: true
        }]
      }
    }
  }
}