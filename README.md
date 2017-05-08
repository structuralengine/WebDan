# webdan

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 1.0.0.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## SetUp

細かいことをやろうとするとドキュメントを読んでいた方がいいので、その URL を列挙しておきます。

> yeoman / generator-webapp
> https://goo.gl/WYtzuO
>
> Bower
> https://goo.gl/j0z3QO
>
> gulpjs / gulp
> https://goo.gl/p8K32Q


### step.1

![git clone](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_131912.png)

git clone

> $ cd __working_directory__
> $ git clone -v "https://github.com/structuralengine/WebDan.git" webdan


### step.2

![bower, gulp の準備](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_133239.png)

bower, gulp の準備

> $ cd webdan
> $ npm install --global gulp-cli bower


### step.3

![開発に必要なライブラリーの準備](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_133536.png)

開発に必要なライブラリーの準備

適当な branch (例 origin/#17) に switch した後、以下を実行してください。

> $ npm install
> $ bower install

![angular のバージョンが不整合](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_133725.png)

内部で要求されている angular のバージョンが不整合なので、入力を要求されます。
最新版で構わないので「2」と入力します。

### step.4

![build](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_134318.png)


1. web サイトの起動

> $ gulp serve

「 http://localhost:9000 」でアクセス可能です。


2. 配布用ファイルの作成 (dist/ ディレクトリ）

> $ gulp
> 
> $ ls dist/

command `gulp` により、内部で `gulp build` が実行され、dist ディレクトリが生成されます。この dist ディレクトリが公開用のファイル群です。


3. 配布用ファイルを使った web サイトの起動

> $ gulp serve:dist

公開用ファイル (dist) を使って web サイトの確認ができます。

以上です。
これにより、開発環境が用意されました