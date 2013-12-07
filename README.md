## トランプユーティリティ for enchant.js

http://daishihmr.github.io/trump.enchant.js/

### ダウンロード
https://github.com/daishihmr/trump.enchant.js/archive/1.1.zip

### 使い方
~~~js
// スペードのエースを作成
var card = new TrumpCard(enchant.trump.SUIT_SPADE, 1); // SUIT_HEART, SUIT_DIAMOND, SUIT_CLUB
scene.addChild(card);

// 裏返しにする
card.opened = false;

// タップしたらアニメーションしながらひっくり返す
card.ontouchstart = function() {
  this.animateReverse();
};

// ジョーカー
var joker = new Joker();

// 54枚組のデッキ
var deck = TrumpCard.createDeck();
for (var i = 0; i < deck.length; i++) {
  scene.addChild(deck[i]);
}

// ジョーカー抜きの52枚組デッキ（シャッフル済み）
var deck2 = TrumpCard.createDeck({
  joker: 0,
  shuffle: true
});
for (var i = 0; i < deck2.length; i++) {
  scene.addChild(deck2[i]);
}

// カードのスートと番号を取得
var card1 = deck[Math.floor(deck.length * Math.random())];
console.log(card1.suit); // ==> 0〜3
console.log(card1.number); // ==> 1〜13
console.log(card1.isJoker); // ==> true or false
~~~
