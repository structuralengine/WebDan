# webdan

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 1.0.0.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## SetUp

�ׂ������Ƃ���낤�Ƃ���ƃh�L�������g��ǂ�ł������������̂ŁA���� URL ��񋓂��Ă����܂��B

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

![bower, gulp �̏���](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_133239.png)

bower, gulp �̏���

> $ cd webdan
> $ npm install --global gulp-cli bower


### step.3

![�J���ɕK�v�ȃ��C�u�����[�̏���](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_133536.png)

�J���ɕK�v�ȃ��C�u�����[�̏���

�K���� branch (�� origin/#17) �� switch ������A�ȉ������s���Ă��������B

> $ npm install
> $ bower install

![angular �̃o�[�W�������s����](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_133725.png)

�����ŗv������Ă��� angular �̃o�[�W�������s�����Ȃ̂ŁA���͂�v������܂��B
�ŐV�łō\��Ȃ��̂Łu2�v�Ɠ��͂��܂��B

### step.4

![build](https://raw.githubusercontent.com/wiki/structuralengine/WebDan/images/2017-05-02_134318.png)


1. web �T�C�g�̋N��

> $ gulp serve

�u http://localhost:9000 �v�ŃA�N�Z�X�\�ł��B


2. �z�z�p�t�@�C���̍쐬 (dist/ �f�B���N�g���j

> $ gulp
> 
> $ ls dist/

command `gulp` �ɂ��A������ `gulp build` �����s����Adist �f�B���N�g������������܂��B���� dist �f�B���N�g�������J�p�̃t�@�C���Q�ł��B


3. �z�z�p�t�@�C�����g���� web �T�C�g�̋N��

> $ gulp serve:dist

���J�p�t�@�C�� (dist) ���g���� web �T�C�g�̊m�F���ł��܂��B

�ȏ�ł��B
����ɂ��A�J�������p�ӂ���܂���