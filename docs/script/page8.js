
// コンテンツ関連のスクリプト -------------------------
app.controller('page8Controller', ['$scope', '$http', function ($scope, $http) {

    // 初期化
    $scope.name = "=";
    $scope.name += "<?xml version='1.0' encoding='utf-16'?>\n";
    $scope.name += "<InputData>\n";
    $scope.name += "  <Nd>0</Nd>\n";
    $scope.name += "  <Md>540</Md>\n";
    $scope.name += "  <Sections>\n";
    $scope.name += "    <clsSection>\n";
    $scope.name += "      <Height>1300</Height>\n";
    $scope.name += "      <WTop>800</WTop>\n";
    $scope.name += "      <WBottom>800</WBottom>\n";
    $scope.name += "      <ElasticID>A</ElasticID>\n";
    $scope.name += "    </clsSection>\n";
    $scope.name += "  </Sections>\n";
    $scope.name += "  <SectionElastic>\n";
    $scope.name += "    <clsSectionElastic>\n";
    $scope.name += "      <fck>24</fck>\n";
    $scope.name += "      <rc>1.0</rc>\n";
    $scope.name += "      <Ec>25</Ec>\n";
    $scope.name += "      <dmax>20</dmax>\n";
    $scope.name += "      <rm>1.0</rm>\n";
    $scope.name += "      <ElasticID>A</ElasticID>\n";
    $scope.name += "    </clsSectionElastic>\n";
    $scope.name += "  </SectionElastic>\n";
    $scope.name += "  <Steels>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>105</Depth>\n";
    $scope.name += "      <i>D29</i>\n";
    $scope.name += "      <n>2</n>\n";
    $scope.name += "      <ElasticID>SD345</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>1201</Depth>\n";
    $scope.name += "      <i>D29</i>\n";
    $scope.name += "      <n>2</n>\n";
    $scope.name += "      <ElasticID>SD345</ElasticID>\n";
    $scope.name += "      <IsTensionBar>true</IsTensionBar>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>433.33</Depth>\n";
    $scope.name += "      <i>D10</i>\n";
    $scope.name += "      <n>2</n>\n";
    $scope.name += "      <ElasticID>SD295</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>866.67</Depth>\n";
    $scope.name += "      <i>D10</i>\n";
    $scope.name += "      <n>2</n>\n";
    $scope.name += "      <ElasticID>SD295</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>150</Depth>\n";
    $scope.name += "      <i>22</i>\n";
    $scope.name += "      <n>400</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>1150</Depth>\n";
    $scope.name += "      <i>22</i>\n";
    $scope.name += "      <n>400</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>208.8</Depth>\n";
    $scope.name += "      <i>12</i>\n";
    $scope.name += "      <n>95.6</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>304.4</Depth>\n";
    $scope.name += "      <i>12</i>\n";
    $scope.name += "      <n>95.6</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>400</Depth>\n";
    $scope.name += "      <i>12</i>\n";
    $scope.name += "      <n>95.6</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>495.6</Depth>\n";
    $scope.name += "      <i>12</i>\n";
    $scope.name += "      <n>95.6</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>591.2</Depth>\n";
    $scope.name += "      <i>12</i>\n";
    $scope.name += "      <n>95.6</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>686.8</Depth>\n";
    $scope.name += "      <i>12</i>\n";
    $scope.name += "      <n>95.6</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>782.4</Depth>\n";
    $scope.name += "      <i>12</i>\n";
    $scope.name += "      <n>95.6</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>878</Depth>\n";
    $scope.name += "      <i>12</i>\n";
    $scope.name += "      <n>95.6</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>973.6</Depth>\n";
    $scope.name += "      <i>12</i>\n";
    $scope.name += "      <n>95.6</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "    <clsSteel>\n";
    $scope.name += "      <Depth>1069.2</Depth>\n";
    $scope.name += "      <i>12</i>\n";
    $scope.name += "      <n>95.6</n>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteel>\n";
    $scope.name += "  </Steels>\n";
    $scope.name += "  <SteelElastic>\n";
    $scope.name += "    <clsSteelElastic>\n";
    $scope.name += "      <fsk>345</fsk>\n";
    $scope.name += "      <rs>1.0</rs>\n";
    $scope.name += "      <Es>200</Es>\n";
    $scope.name += "      <rm>1.0</rm>\n";
    $scope.name += "      <c>660</c>\n";
    $scope.name += "      <pw>0.15</pw>\n";
    $scope.name += "      <kw>1.0</kw>\n";
    $scope.name += "      <ElasticID>SD345</ElasticID>\n";
    $scope.name += "    </clsSteelElastic>\n";
    $scope.name += "    <clsSteelElastic>\n";
    $scope.name += "      <fsk>295</fsk>\n";
    $scope.name += "      <rs>1.0</rs>\n";
    $scope.name += "      <Es>200</Es>\n";
    $scope.name += "      <rm>1.0</rm>\n";
    $scope.name += "      <c>660</c>\n";
    $scope.name += "      <pw>0.15</pw>\n";
    $scope.name += "      <kw>1.0</kw>\n";
    $scope.name += "      <ElasticID>SD295</ElasticID>\n";
    $scope.name += "    </clsSteelElastic>\n";
    $scope.name += "    <clsSteelElastic>\n";
    $scope.name += "      <fsk>235</fsk>\n";
    $scope.name += "      <rs>1.0</rs>\n";
    $scope.name += "      <Es>200</Es>\n";
    $scope.name += "      <rm>1.0</rm>\n";
    $scope.name += "      <c>660</c>\n";
    $scope.name += "      <pw>0.15</pw>\n";
    $scope.name += "      <kw>1.0</kw>\n";
    $scope.name += "      <ElasticID>SS400</ElasticID>\n";
    $scope.name += "    </clsSteelElastic>\n";
    $scope.name += "  </SteelElastic>\n";
    $scope.name += "</InputData>\n";
    
    // [送信] ボタンで 非同期通信を開始
    $scope.onclick = function () {
        $http({
            method: 'POST',
            //url: './api/values/',
            url: 'http://www.structuralengine.com/RCNonlinear/api/values/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $scope.name 
        })
        // 通信成功時の処理
        .success(function (data, status, headers, config) {
            $scope.result = data;
        })
        // 通信失敗時の処理
        .error(function (data, status, headers, config) {
            $scope.result = '!!通信に失敗しました!!';
        });
    };


}]);



