// コンテンツ関連のスクリプト -------------------------
app.controller('Page2Controller', ['$scope', 'ValuesSvc', 'CalcSvc', function ($scope, ValuesSvc, CalcSvc) {

    var ctrl = this;

    // 初期化
    ctrl.result = '';

    ctrl.data = (function () {/*
                <?xml version='1.0' encoding='utf-16' ?>
                <InputData>
                    <Nd>0</Nd>
                    <Md>540</Md>
                    <Sections>
                        <clsSection>
                            <Height>1300</Height>
                            <WTop>800</WTop>
                            <WBottom>800</WBottom>
                            <ElasticID>A</ElasticID>
                        </clsSection>
                    </Sections>
                    <SectionElastic>
                        <clsSectionElastic>
                            <fck>24</fck>
                            <rc>1.0</rc>
                            <Ec>25</Ec>
                            <dmax>20</dmax>
                            <rm>1.0</rm>
                            <ElasticID>A</ElasticID>
                        </clsSectionElastic>
                    </SectionElastic>
                    <Steels>
                        <clsSteel>
                            <Depth>105</Depth>
                            <i>D29</i>
                            <n>2</n>
                            <ElasticID>SD345</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>1201</Depth>
                            <i>D29</i>
                            <n>2</n>
                            <ElasticID>SD345</ElasticID>
                            <IsTensionBar>true</IsTensionBar>
                        </clsSteel>
                        <clsSteel>
                            <Depth>433.33</Depth>
                            <i>D10</i>
                            <n>2</n>
                            <ElasticID>SD295</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>866.67</Depth>
                            <i>D10</i>
                            <n>2</n>
                            <ElasticID>SD295</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>150</Depth>
                            <i>22</i>
                            <n>400</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>1150</Depth>
                            <i>22</i>
                            <n>400</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>208.8</Depth>
                            <i>12</i>
                            <n>95.6</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>304.4</Depth>
                            <i>12</i>
                            <n>95.6</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>400</Depth>
                            <i>12</i>
                            <n>95.6</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>495.6</Depth>
                            <i>12</i>
                            <n>95.6</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>591.2</Depth>
                            <i>12</i>
                            <n>95.6</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>686.8</Depth>
                            <i>12</i>
                            <n>95.6</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>782.4</Depth>
                            <i>12</i>
                            <n>95.6</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>878</Depth>
                            <i>12</i>
                            <n>95.6</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>973.6</Depth>
                            <i>12</i>
                            <n>95.6</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                        <clsSteel>
                            <Depth>1069.2</Depth>
                            <i>12</i>
                            <n>95.6</n>
                            <ElasticID>SS400</ElasticID>
                        </clsSteel>
                    </Steels>
                    <SteelElastic>
                        <clsSteelElastic>
                            <fsk>345</fsk>
                            <rs>1.0</rs>
                            <Es>200</Es>
                            <rm>1.0</rm>
                            <c>660</c>
                            <pw>0.15</pw>
                            <kw>1.0</kw>
                            <ElasticID>SD345</ElasticID>
                        </clsSteelElastic>
                        <clsSteelElastic>
                            <fsk>295</fsk>
                            <rs>1.0</rs>
                            <Es>200</Es>
                            <rm>1.0</rm>
                            <c>660</c>
                            <pw>0.15</pw>
                            <kw>1.0</kw>
                            <ElasticID>SD295</ElasticID>
                        </clsSteelElastic>
                        <clsSteelElastic>
                            <fsk>235</fsk>
                            <rs>1.0</rs>
                            <Es>200</Es>
                            <rm>1.0</rm>
                            <c>660</c>
                            <pw>0.15</pw>
                            <kw>1.0</kw>
                            <ElasticID>SS400</ElasticID>
                        </clsSteelElastic>
                    </SteelElastic>
                </InputData>
*/
    }).toString().match(/\/\*([^]*)\*\//)[1];

    ctrl.getComments = function () {
        ValuesSvc.getList()  // GET: /comments
        .then(function (comments) {
            // returns a list of comments
            ctrl.result = JSON.stringify(comments);

        }, function errorCallback(error) {
            alert("エラー:" + JSON.stringify(error));
        });
    };

    ctrl.postData = function () {
        CalcSvc.post({xmlData:ctrl.data})
        .then(function (result) {
            // returns a list of comments
            ctrl.result = JSON.stringify(result);

        }, function errorCallback(error) {
            alert("エラー:" + JSON.stringify(error));
        });
    }

}]);
