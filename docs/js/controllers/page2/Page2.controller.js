
// コンテンツ関連のスクリプト -------------------------
app.controller('Page2Controller', ['$scope', function ($scope) {

    var ctrl = this;


    ctrl.data = [
      {
          "id": 1,
          "name": {
              "first": "John",
              "last": "Schmidt"
          },
          "address": "45024 France",
          "price": 760.41,
          "isActive": "Yes",
          "product": {
              "description": "Fried Potatoes",
              "options": [
                {
                    "description": "Fried Potatoes",
                    "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png"
                },
                {
                    "description": "Fried Onions",
                    "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png"
                }
              ]
          }
      },
      {
          "id": 2,
          "name": {
              "first": "Tead",
              "last": "Fancy"
          },
          "address": "94115 Japan",
          "price": 982.32,
          "isActive": "No",
          "product": {
              "description": "Felis silvestris catus",
              "options": [
                {
                    "description": "Felis silvestris catus",
                    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Cat_poster_1.jpg/1024px-Cat_poster_1.jpg"
                },
                {
                    "description": "Felis silvestris lybica",
                    "image": "https://upload.wikimedia.org/wikipedia/commons/a/ae/AfricanWildCat.jpg?download"
                }
              ]
          }
      },
      {
          "id": 3,
          "name": {
              "first": "Tead",
              "last": "Fancy"
          },
          "address": "94115 Ronson",
          "price": 982.32,
          "isActive": "No",
          "product": {
              "description": "Felis silvestris catus",
              "options": [
                {
                    "description": "Felis silvestris catus",
                    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Cat_poster_1.jpg/1024px-Cat_poster_1.jpg"
                },
                {
                    "description": "Felis silvestris lybica",
                    "image": "https://upload.wikimedia.org/wikipedia/commons/a/ae/AfricanWildCat.jpg?download"
                }
              ]
          }
      }
    ];
}]);
