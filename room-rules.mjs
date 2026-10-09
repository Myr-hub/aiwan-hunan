// 独立教学示例，不是爱玩项目原始源码。
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
