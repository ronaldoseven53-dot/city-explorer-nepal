export function getActivityIcon(activity: string): string {
  const a = activity.toLowerCase();
  if (a.includes("trek") || a.includes("trail"))               return "🥾";
  if (a.includes("hike") || a.includes("ice lake"))            return "🧗";
  if (a.includes("paraglid") || a.includes("ultralight"))      return "🪂";
  if (a.includes("photo"))                                      return "📸";
  if (a.includes("boat") || a.includes("kayak"))               return "🛶";
  if (a.includes("raft") || a.includes("river"))               return "🌊";
  if (a.includes("zip"))                                        return "🎿";
  if (a.includes("temple") || a.includes("stupa"))             return "🛕";
  if (a.includes("monastery") || a.includes("gompa"))          return "⛩️";
  if (a.includes("pilgrimage") || a.includes("meditation"))    return "🧘";
  if (a.includes("cycl") || a.includes("bike"))                return "🚴";
  if (a.includes("tea"))                                        return "🍵";
  if (a.includes("cook") || a.includes("cuisin"))              return "🍽️";
  if (a.includes("bird"))                                       return "🦅";
  if (a.includes("wildlife"))                                   return "🐾";
  if (a.includes("cave"))                                       return "🦇";
  if (a.includes("camp"))                                       return "⛺";
  if (a.includes("festival"))                                   return "🎊";
  if (a.includes("jeep") || a.includes("safari"))              return "🚙";
  if (a.includes("sunrise") || a.includes("viewpoint"))        return "🌄";
  if (a.includes("glacier") || a.includes("lake"))             return "🏞️";
  if (a.includes("market") || a.includes("bazaar"))            return "🛍️";
  if (a.includes("museum") || a.includes("heritage"))          return "🏛️";
  if (a.includes("walk") || a.includes("cultural"))            return "🚶";
  if (a.includes("mountain flight") || a.includes("aircraft")) return "✈️";
  return "✨";
}

export function getWildlifeIcon(animal: string): string {
  const w = animal.toLowerCase();
  if (w.includes("snow leopard"))                              return "🐆";
  if (w.includes("leopard"))                                   return "🐆";
  if (w.includes("tiger"))                                     return "🐅";
  if (w.includes("elephant"))                                  return "🐘";
  if (w.includes("rhino"))                                     return "🦏";
  if (w.includes("monkey") || w.includes("macaque") || w.includes("langur")) return "🐒";
  if (w.includes("bear"))                                      return "🐻";
  if (w.includes("deer") || w.includes("chital") || w.includes("muntjac"))   return "🦌";
  if (w.includes("wolf"))                                      return "🐺";
  if (w.includes("fox"))                                       return "🦊";
  if (w.includes("panda"))                                     return "🐼";
  if (w.includes("eagle") || w.includes("vulture") || w.includes("kite"))    return "🦅";
  if (w.includes("pheasant") || w.includes("monal") || w.includes("peacock"))return "🦚";
  if (w.includes("stork"))                                     return "🦢";
  if (w.includes("fish") || w.includes("mahseer"))            return "🐟";
  if (w.includes("snake") || w.includes("python"))            return "🐍";
  if (w.includes("lizard") || w.includes("monitor"))          return "🦎";
  if (w.includes("bird") || w.includes("sparrow") || w.includes("myna") || w.includes("flycatcher") || w.includes("bulbul") || w.includes("babbler")) return "🐦";
  if (w.includes("bat"))                                       return "🦇";
  if (w.includes("marmot"))                                    return "🐿️";
  if (w.includes("sheep") || w.includes("bharal") || w.includes("tahr"))     return "🐑";
  if (w.includes("boar"))                                      return "🐗";
  if (w.includes("porcupine") || w.includes("civet"))         return "🦔";
  if (w.includes("kiang") || w.includes("ass"))               return "🫏";
  return "🐾";
}
