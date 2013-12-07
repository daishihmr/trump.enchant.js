(function() {

enchant.trump = {};

enchant.trump.ASSET_NAME_ICON = "images/icon0.png";
enchant.trump.ASSET_NAME_FONT = "images/font0.png";

enchant.trump.SUIT_SPADE = 0;
enchant.trump.SUIT_HEART = 1;
enchant.trump.SUIT_DIAMOND = 2;
enchant.trump.SUIT_CLUB = 3;

enchant.trump.CARD_WIDTH = 28;
enchant.trump.CARD_HEIGHT = 38;

var HP = Math.PI / 2;
var ICON = enchant.trump.ASSET_NAME_ICON;
var FONT = enchant.trump.ASSET_NAME_FONT;
var WIDTH = enchant.trump.CARD_WIDTH;
var HEIGHT = enchant.trump.CARD_HEIGHT;
var ICON_X = [3, 6, 5, 4];
var FONT_X = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10, 1, 11];
var FONT_Y = [2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 3, 2];

/**
 * トランプのカード.
 */
enchant.trump.TrumpCard = enchant.Class.create(enchant.Sprite, {

    _suit: 0,
    _number: 0,
    _isJoker: false,

    _faceImage: null,
    _backImage: null,

    _opened: false,

    /**
     * コンストラクタ.
     */
    initialize: function(suit, number) {
        enchant.Sprite.call(this, WIDTH, HEIGHT);

        this._suit = suit;
        this._number = number;
        this._isJoker = false;

        this._faceImage = this._createFaceImage();
        this._backImage = this._createBackImage();

        this.opened = true;
    },

    /**
     * スート.
     */
    suit: {
        get: function() { return this._suit; }
    },

    /**
     * 数字.
     */
    number: {
        get: function() { return this._number; }
    },

    /**
     * ジョーカー.
     */
    isJoker: {
        get: function() { return this._isJoker; }
    },

    /**
     * 表向き.
     */
    opened: {
        get: function() {
            return this._opened;
        },
        set: function(v) {
            this._opened = v;
            if (v) {
                this.image = this._faceImage;
            } else {
                this.image = this._backImage;
            }
        }
    },

    _createFaceImage: function() {
        var texture = new enchant.Surface(WIDTH, HEIGHT);
        var ctx = texture.context;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(        4,          4, 4-1, -HP*2, -HP, false);
        ctx.arc(WIDTH - 4,          4, 4-1,   -HP,   0, false);
        ctx.arc(WIDTH - 4, HEIGHT - 4, 4-1,     0,  HP, false);
        ctx.arc(        4, HEIGHT - 4, 4-1,    HP,HP*2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (this._suit !== -1) {
            texture.draw(enchant.Core.instance.assets[ICON],
                16*ICON_X[this._suit], 16*4, 16, 16,
                6, 2, 16, 16);
        }

        if (this._number === 10) {
            texture.draw(enchant.Core.instance.assets[FONT],
                16*1, 16*1, 16, 16,
                4, 2+16+2, 10, 16);
            texture.draw(enchant.Core.instance.assets[FONT],
                16*0, 16*1, 16, 16,
                14, 2+16+2, 10, 16);
        } else if (this._number !== -1) {
            texture.draw(enchant.Core.instance.assets[FONT],
                16*FONT_X[this._number-1], 16*FONT_Y[this._number-1], 16, 16,
                6+2, 2+16+2, 16, 16);
        }

        return texture;
    },

    _createBackImage: function() {
        if (enchant.trump.TrumpCard.BACKIMAGE !== null) {
            return enchant.trump.TrumpCard.BACKIMAGE;
        }

        var texture = new enchant.Surface(WIDTH, HEIGHT);
        var ctx = texture.context;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "rgb(128, 128, 256)";
        ctx.beginPath();
        ctx.arc(        4,          4, 4-1, -HP*2, -HP, false);
        ctx.arc(WIDTH - 4,          4, 4-1,   -HP,   0, false);
        ctx.arc(WIDTH - 4, HEIGHT - 4, 4-1,     0,  HP, false);
        ctx.arc(        4, HEIGHT - 4, 4-1,    HP,HP*2, false);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = "rgb(32, 16, 84)";
        ctx.fillRect(4, 4, WIDTH-8, HEIGHT-8);
        ctx.strokeStyle = "rgb(16, 0, 32)";
        ctx.strokeRect(4, 4, WIDTH-8, HEIGHT-8);

        enchant.trump.TrumpCard.BACKIMAGE = texture;

        return texture;
    },

    /**
     * 比較.
     *
     * ジョーカー > スペード > ハート > ダイヤ > クラブ
     *
     * 同一スートの場合
     * エース > キング > クイーン > ジャック > 10 > ... > 2
     */
    compareTo: function(another) {
        if (this._isJoker) {
            if (another._isJoker) {
                return 0;
            } else {
                return 1;
            }
        } else {
            if (another._isJoker) {
                return -1;
            } else {
                if (this._suit != another.suit) {
                    return another.suit - this._suit;
                } else {
                    if (this._number === 1) {
                        if (another.number === 1) {
                            return 0;
                        } else {
                            return 1;
                        }
                    } else {
                        if (another.number === 1) {
                            return -1;
                        } else {
                            return this._number - another.number;
                        }
                    }
                }
            }
        }
    },

    /**
     * アニメーション付きでひっくり返す.
     */
    animateReverse: function() {
        this.tl.clear()
            .scaleTo(0, 1, 5)
            .exec(function() {
                this.opened = !this.opened;
                this.tl.scaleTo(1, 1, 5)
            });
    }

});

enchant.trump.TrumpCard.compare = function(a, b) {
    return a.compareTo(b);
};

enchant.trump.TrumpCard.BACKIMAGE = null;

enchant.trump.Joker = enchant.Class.create(enchant.trump.TrumpCard, {

    initialize: function() {
        enchant.trump.TrumpCard.call(this, -1, -1);
        this._isJoker = true;

        this.image.draw(enchant.Core.instance.assets[ICON],
            16*11, 16*0, 16, 16,
            6, 12, 16, 16);
    }

});

/**
 * カードデッキを生成する.
 *
 * params.joker ジョーカーの数
 * params.shuffle シャッフルする
 */
enchant.trump.TrumpCard.createDeck = function(params) {
    params = params || {};
    params.joker = params.joker === undefined ? DEFAULT_PAEAM.joker : params.joker;

    var deck = [];
    for (var s = 0; s < 4; s++) {
        for (var n = 1; n <= 13; n++) {
            deck.push(new enchant.trump.TrumpCard(s, n));
        }
    }
    for (var i = 0; i < params.joker; i++) {
        deck.push(new enchant.trump.Joker());
    }

    if (params.shuffle) {
        var tmp = deck.slice();
        deck = [];
        while (tmp.length) {
            deck.push(tmp.splice(Math.floor(tmp.length * Math.random()), 1)[0]);
        }
    }

    return deck;
};

var DEFAULT_PAEAM = {
    joker: 2,
    shuffle: false
};

})();
