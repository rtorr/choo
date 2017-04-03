var persist = require('choo-persist')
var expose = require('choo-expose')
var logger = require('choo-log')
var css = require('sheetify')
var choo = require('../')

css('todomvc-common/base.css')
css('todomvc-app-css/index.css')

var app = choo()

app.use(persist())
app.use(logger())
app.use(expose())
app.use(require('./todo-store'))

app.route('/', require('./main-view'))
app.route('#active', require('./main-view'))
app.route('#completed', require('./main-view'))
app.mount('body')
