
// コンテンツ関連のスクリプト -------------------------
app.controller('Page8Controller', ['$scope', 'ValuesSvc', 'CalcSvc', function ($scope, ValuesSvc, CalcSvc) {

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
        CalcSvc.post({ xmlData: ctrl.data })
        .then(function (comments) {
            // returns a list of comments
            ctrl.result = JSON.stringify(comments);

        }, function errorCallback(error) {
            alert("エラー:" + JSON.stringify(error));
        });
    };

}]);


/*

// コンテンツ関連のスクリプト -------------------------
app.controller('Page8Controller', ['$scope', '$http', function ($scope, $http) {

    var ctrl = this;

    // 初期化
    ctrl.name = "=";
    ctrl.name += "<?xml version='1.0' encoding='utf-16'?>\n";
    ctrl.name += "<InputData>\n";
    ctrl.name += "  <Nd>0</Nd>\n";
    ctrl.name += "  <Md>540</Md>\n";
    ctrl.name += "  <Sections>\n";
    ctrl.name += "    <clsSection>\n";
    ctrl.name += "      <Height>1300</Height>\n";
    ctrl.name += "      <WTop>800</WTop>\n";
    ctrl.name += "      <WBottom>800</WBottom>\n";
    ctrl.name += "      <ElasticID>A</ElasticID>\n";
    ctrl.name += "    </clsSection>\n";
    ctrl.name += "  </Sections>\n";
    ctrl.name += "  <SectionElastic>\n";
    ctrl.name += "    <clsSectionElastic>\n";
    ctrl.name += "      <fck>24</fck>\n";
    ctrl.name += "      <rc>1.0</rc>\n";
    ctrl.name += "      <Ec>25</Ec>\n";
    ctrl.name += "      <dmax>20</dmax>\n";
    ctrl.name += "      <rm>1.0</rm>\n";
    ctrl.name += "      <ElasticID>A</ElasticID>\n";
    ctrl.name += "    </clsSectionElastic>\n";
    ctrl.name += "  </SectionElastic>\n";
    ctrl.name += "  <Steels>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>105</Depth>\n";
    ctrl.name += "      <i>D29</i>\n";
    ctrl.name += "      <n>2</n>\n";
    ctrl.name += "      <ElasticID>SD345</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>1201</Depth>\n";
    ctrl.name += "      <i>D29</i>\n";
    ctrl.name += "      <n>2</n>\n";
    ctrl.name += "      <ElasticID>SD345</ElasticID>\n";
    ctrl.name += "      <IsTensionBar>true</IsTensionBar>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>433.33</Depth>\n";
    ctrl.name += "      <i>D10</i>\n";
    ctrl.name += "      <n>2</n>\n";
    ctrl.name += "      <ElasticID>SD295</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>866.67</Depth>\n";
    ctrl.name += "      <i>D10</i>\n";
    ctrl.name += "      <n>2</n>\n";
    ctrl.name += "      <ElasticID>SD295</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>150</Depth>\n";
    ctrl.name += "      <i>22</i>\n";
    ctrl.name += "      <n>400</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>1150</Depth>\n";
    ctrl.name += "      <i>22</i>\n";
    ctrl.name += "      <n>400</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>208.8</Depth>\n";
    ctrl.name += "      <i>12</i>\n";
    ctrl.name += "      <n>95.6</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>304.4</Depth>\n";
    ctrl.name += "      <i>12</i>\n";
    ctrl.name += "      <n>95.6</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>400</Depth>\n";
    ctrl.name += "      <i>12</i>\n";
    ctrl.name += "      <n>95.6</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>495.6</Depth>\n";
    ctrl.name += "      <i>12</i>\n";
    ctrl.name += "      <n>95.6</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>591.2</Depth>\n";
    ctrl.name += "      <i>12</i>\n";
    ctrl.name += "      <n>95.6</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>686.8</Depth>\n";
    ctrl.name += "      <i>12</i>\n";
    ctrl.name += "      <n>95.6</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>782.4</Depth>\n";
    ctrl.name += "      <i>12</i>\n";
    ctrl.name += "      <n>95.6</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>878</Depth>\n";
    ctrl.name += "      <i>12</i>\n";
    ctrl.name += "      <n>95.6</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>973.6</Depth>\n";
    ctrl.name += "      <i>12</i>\n";
    ctrl.name += "      <n>95.6</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "    <clsSteel>\n";
    ctrl.name += "      <Depth>1069.2</Depth>\n";
    ctrl.name += "      <i>12</i>\n";
    ctrl.name += "      <n>95.6</n>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteel>\n";
    ctrl.name += "  </Steels>\n";
    ctrl.name += "  <SteelElastic>\n";
    ctrl.name += "    <clsSteelElastic>\n";
    ctrl.name += "      <fsk>345</fsk>\n";
    ctrl.name += "      <rs>1.0</rs>\n";
    ctrl.name += "      <Es>200</Es>\n";
    ctrl.name += "      <rm>1.0</rm>\n";
    ctrl.name += "      <c>660</c>\n";
    ctrl.name += "      <pw>0.15</pw>\n";
    ctrl.name += "      <kw>1.0</kw>\n";
    ctrl.name += "      <ElasticID>SD345</ElasticID>\n";
    ctrl.name += "    </clsSteelElastic>\n";
    ctrl.name += "    <clsSteelElastic>\n";
    ctrl.name += "      <fsk>295</fsk>\n";
    ctrl.name += "      <rs>1.0</rs>\n";
    ctrl.name += "      <Es>200</Es>\n";
    ctrl.name += "      <rm>1.0</rm>\n";
    ctrl.name += "      <c>660</c>\n";
    ctrl.name += "      <pw>0.15</pw>\n";
    ctrl.name += "      <kw>1.0</kw>\n";
    ctrl.name += "      <ElasticID>SD295</ElasticID>\n";
    ctrl.name += "    </clsSteelElastic>\n";
    ctrl.name += "    <clsSteelElastic>\n";
    ctrl.name += "      <fsk>235</fsk>\n";
    ctrl.name += "      <rs>1.0</rs>\n";
    ctrl.name += "      <Es>200</Es>\n";
    ctrl.name += "      <rm>1.0</rm>\n";
    ctrl.name += "      <c>660</c>\n";
    ctrl.name += "      <pw>0.15</pw>\n";
    ctrl.name += "      <kw>1.0</kw>\n";
    ctrl.name += "      <ElasticID>SS400</ElasticID>\n";
    ctrl.name += "    </clsSteelElastic>\n";
    ctrl.name += "  </SteelElastic>\n";
    ctrl.name += "</InputData>\n";

    // [送信] ボタンで 非同期通信を開始
    ctrl.onclick = function () {
        $http({
            method: 'POST',
            url: './api/values', //url: 'http://www.structuralengine.com/RCNonlinear/api/values',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: ctrl.name
        })
        // 通信成功時の処理
        .success(function (data, status, headers, config) {
            ctrl.result = data;
        })
        // 通信失敗時の処理
        .error(function (data, status, headers, config) {
            ctrl.result = '!!通信に失敗しました!!';
        });
    };


}]);

*/