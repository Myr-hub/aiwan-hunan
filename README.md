# 爱玩湖南地方玩法：麻将与跑得快房间规则配置

爱玩湖南地方玩法包含麻将、扑克、字牌三个分类，并提供创建房间、加入房间和俱乐部入口。地方玩法共用房间设置界面，具体规则随所选玩法切换。

本文介绍麻将与跑得快的配置方式，并提供一个可运行的 JavaScript 校验示例。示例用于说明配置数据的组织与检查，不是项目原始源码。

## 玩法分类

| 分类 | 部分玩法 |
| --- | --- |
| 麻将 | 湘阴推倒胡、耒阳鬼麻将、衡阳258麻将、长沙麻将、怀化麻将、红中麻将、转转麻将、邵阳麻将、蓝山麻将 |
| 扑克 | 跑得快十六张、跑得快十五张、霸炸弹、打筒子、三打哈、衡阳三打哈 |
| 字牌 | 独立分类入口 |

以上是部分玩法名称，不作为完整游戏清单。

## 麻将房间

怀化麻将的房间设置包含 2、3、4 人选项，以及 8 局、16 局选项。规则项包括带红中、荒庄荒杠、可抢杠胡、包杠、抢杠全包、殿后可杠、接炮胡和部分牌型选项。

人数和局数采用单选控件，规则开关采用复选控件。同一设置页可以呈现不同地方玩法的选项，但每个玩法允许的值应单独定义。

![怀化麻将规则局部](images/mahjong-rules.webp)

*怀化麻将规则区域节选。配图仅展示规则面板，不代表完整功能界面。*

## 跑得快房间

跑得快十六张提供 2 人、3 人设置，局数可选 8、10、15、20 局。规则配置包含显示牌或不显示牌、必出或非必出、赢家先出或黑三先出，以及满分结束相关选项。

这类配置需要区分“选项值”和“显示名称”。例如，界面显示“赢家先出”，程序内部可以用稳定的字段保存这个选择，避免后续修改文案时影响已保存的房间数据。

![跑得快规则局部](images/paodekuai-rules.webp)

*跑得快十六张规则区域节选。*

## 配置校验示例

下面用两个预设演示人数、局数和规则开关的检查。预设只选取少量选项，不覆盖完整玩法，也不实现发牌、出牌、胡牌或计分算法。

```js
const presets = {
  huaihua: {
    players: [2, 3, 4], rounds: [8, 16],
    flags: ['redCenter', 'robKong', 'discardWin']
  },
  paodekuai16: {
    players: [2, 3], rounds: [8, 10, 15, 20],
    flags: ['showRemaining', 'mustPlay', 'winnerFirst']
  }
};

export function validateRoom(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error('房间配置必须是对象');
  const keys = ['game', 'players', 'rounds', 'flags'];
  if (Object.keys(input).some(key => !keys.includes(key)))
    throw new Error('包含未知字段');
  if (typeof input.game !== 'string' ||
      !Object.hasOwn(presets, input.game))
    throw new Error('不支持的玩法');
  const preset = presets[input.game];
  if (!preset.players.includes(input.players))
    throw new Error('人数不匹配');
  if (!preset.rounds.includes(input.rounds))
    throw new Error('局数不匹配');
  const flags = input.flags ?? [];
  if (!Array.isArray(flags) ||
      flags.some(flag => !preset.flags.includes(flag)) ||
      new Set(flags).size !== flags.length)
    throw new Error('规则开关无效或重复');
  return {
    game: input.game, players: input.players,
    rounds: input.rounds, flags: [...flags]
  };
}
```

完整示例文件：[room-rules.mjs](room-rules.mjs)。在仓库目录运行以下命令即可检查一组配置：

```sh
node --input-type=module -e "import { validateRoom } from './room-rules.mjs'; console.log(validateRoom({ game: 'paodekuai16', players: 3, rounds: 10, flags: ['mustPlay'] }));"
```

返回结果：

```json
{ "game": "paodekuai16", "players": 3, "rounds": 10, "flags": ["mustPlay"] }
```

同一接口收到 4 人跑得快、字符串局数或不属于该玩法的开关时，会拒绝配置。合法结果重新复制开关数组，调用方随后修改输入数组，不会连带改变已验证的数据。

## 实现要点

切换玩法时，需要同步切换允许人数、局数和规则选项；不能将上一种玩法的隐藏选项直接带到新房间。已有房间保存玩法标识与规则版本，后续调整默认设置时，仍可按创建时的规则解释旧数据。

客户端检查用于及时提示，服务端还需要独立检查允许值，并以服务端保存的房间配置为准。上面的示例只处理参数校验；房间成员权限、并发创建和规则之间的互斥关系属于另外的处理步骤。

## 资料与交流

项目名称、玩法资料及两张局部配图来源：[九牛源码的爱玩湖南地方玩法介绍](https://www.9nweb.com/post/4426.html)。配图经 AI 整理为规则区域示意，去除窗口边框和面板外区域，并非逐像素原图；界面素材权利归各自权利人；本文不提供第三方游戏源码或安装包下载。

技术交流：[Telegram @root4433](https://t.me/root4433)。
