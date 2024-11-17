Component({
  properties: {
    // clear | qr | f-vip3 | a-index-mingpian | index-geren2 | index-qiye | MP12-mingpiannan | MP29-zhaopian | a-MP31xuanze | a-MPbianjishuru | MPbiaodanmoban | index-gerenxinxi | MPditu | MPfanhuijiantou | MPchakan | MPfenxiang2 | MPditudaohang | MPhuidaodingbu | MPfuzhi2 | MPyulan3 | MPfuzhi | MPdizhi | MPlianjie | a-MPxiaochengxu1 | MPshanchu | T-MPbaocun | chenggong | T-MPdizhi | T-MPyouxiang | qiyerenzheng2 | fujin | MPyulan | huiyuan | xiangyoujiantou | huiyi | dianhua_tianchong | sousuo | renzheng | tishi | a-T-MP31dianhua | T-MPweixin | qiye2 | sousuowenjian | shimingrenzheng | shanghui | huiyishi
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 36,
      observer: function(size) {
        this.setData({
          svgSize: size / 750 * wx.getSystemInfoSync().windowWidth,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 36 / 750 * wx.getSystemInfoSync().windowWidth,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
