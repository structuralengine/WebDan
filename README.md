# webdan

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 1.0.0.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## SetUp

細かいことをやろうとするとドキュメントを読んでぁE��方がいぁE�Eで、その URL を�E挙しておきます、E

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

![開発に忁E��なライブラリーの準備](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_133536.png)

開発に忁E��なライブラリーの準備

適当な branch (侁Eorigin/#17) に switch した後、以下を実行してください、E

> $ npm install
> $ bower install

![angular のバ�Eジョン](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_133725.png)

冁E��で要求されてぁE�� angular のバ�Eジョンが不整合なので、�E力を要求されます、E
最新版で構わなぁE�Eで、E」と入力します、E


### step.4

![build](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_134318.png)


1. web サイト�E起勁E

> $ gulp serve

、Ehttp://localhost:9000 」でアクセス可能です、E


2. 配币E��ファイルの作�E (dist/ チE��レクトリ�E�E

> $ gulp
> $ ls dist/

command `gulp` により、�E部で `gulp build` が実行され、dist チE��レクトリが生成されます。この dist チE��レクトリが�E開用のファイル群です、E


3. 配币E��ファイルを使っぁEweb サイト�E起勁E

> $ gulp serve:dist

公開用ファイル (dist) を使って web サイト�E確認ができます、E

以上です、E
これにより、E��発環墁E��用意されました、E
