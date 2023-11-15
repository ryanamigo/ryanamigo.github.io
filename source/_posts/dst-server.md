---
title: 使用docker开饥荒联机版服务器
date: 2023-07-06 14:42:20
tags:
  - 饥荒
category:
  - 游戏
cover: http://oss.ryanamigo.com/blog/dst-cover.jpg
---

## 选择镜像

目前持续更新，并且稳定的镜像是[jamesits提供的镜像](https://hub.docker.com/r/jamesits/dst-server)，详细文档可访问[github](https://github.com/Jamesits/docker-dst-server)。

## 启动

### docker run
使用普通的docker-run命令
```shell
docker run -v ./DoNotStarveTogether:/data -d -p 10999-11000:10999-11000/udp -p 12346-12347:12346-12347/udp -e "DST_SERVER_ARCH=amd64" -it jamesits/dst-server:latest
```

- `-v`的意思是将本机的当前目录下的`DoNotStarveTogether`文件夹映射到docker容器中，这样把容器删除后也不会丢失数据
- `-p`的意思是将本机的10999 11000 12346 12347这4个udp端口映射到容器对应的端口
- `-e`的意思是设置容器启动的环境变量，即amd64架构
- `it`的意思是以交互模式运行容器(i)，并为容器重新分配一个伪输入终端(t)

建议把命令写在一个文件中，方便执行，例如
```
echo "docker run -v ./DoNotStarveTogether:/data -d -p 10999-11000:10999-11000/udp -p 12346-12347:12346-12347/udp -e "DST_SERVER_ARCH=amd64" -it jamesits/dst-server:latest" >> start.sh
chmod +x ./start.sh
```
之后执行 `./start.sh`即可
<!-- more -->

### docker-compose
[jamesits](https://github.com/Jamesits/docker-dst-server)提供了docker-compose配置，可直接使用，这样更方便与服务器上的其他容器一起管理
```yml
version: '3.5'
services:
  dst-server:
     image: jamesits/dst-server:latest
     restart: "on-failure:5"
     ports:
        - "10999-11000:10999-11000/udp"
        - "12346-12347:12346-12347/udp"
     volumes:
        - ~/.klei/DoNotStarveTogether:/data
     stop_grace_period: 6m
```

## 服务配置
容器启动后会看到多了一个目录`DontStarveTogether`


### token

饥荒开服需要从Klei获取自己账号的token，获取地址在[这里](https://accounts.klei.com/account/game/servers?game=DontStarveTogether)
![](http://oss.ryanamigo.com/blog/dst-1.jpg)
获取到token后，将token放到`./DoNotStarveTogether/DoNotStarveTogether/Cluster_1/cluster_token.txt`文件中

### 基本信息
`cluster.ini`配置了服务器的基本信息
```ini
; Here is all the server configs you will ever want to change
[NETWORK]
; DO change the name and description please!
cluster_name = xxxx
cluster_description = xxxxxx
cluster_password = axxxx111111
; 最好把这个加上，要不人物说的都是英文
cluster_language = zh
offline_cluster = false
lan_only_cluster = false
whitelist_slots = 1
cluster_intention = social
autosaver_enabled = true
;tick_rate = 30

[GAMEPLAY]
game_mode = endless
max_players = 8
pvp = false
pause_when_empty = true
vote_kick_enabled = false

[STEAM]
steam_group_only = false
steam_group_id = 0
steam_group_admins = false

[MISC]
console_enabled = true
max_snapshots = 6

; ====================================================================
; STOP! Don't change configs below unless you know what you are doing.
; ====================================================================
[SHARD]
shard_enabled = true
bind_ip = 127.0.0.1
master_ip = 127.0.0.1
master_port = 10998
cluster_key = xxxxxx
```

最好在`NETWORK`中加上`cluster_language = zh`，要不人物说的都是英文。更多配置见下方附录

### 管理员
你的Token中，两个`^`符号中间就是你的Klei账号id，在`adminlist.txt`中粘贴Klei账号id即可(不要带上^)

## mod配置

饥荒服务器使用mod有两个步骤
1. 添加/下载mod
2. 启用mod

### 添加/下载mod

在刚才的文件目录中，有一个`mods`目录，完整路径`./DoNotStarveTogether/DoNotStarveTogether/Cluster_1/mods`,这里有一个文件，`dedicated_server_mods_setup.lua`，这里配置需要下载的mod，例如
```lua
-- 血条
ServerModSetup("1185229307")
-- 防卡
ServerModSetup("2505341606")
-- 智能小木牌
ServerModSetup("1595631294")
-- 4/5/6格装备栏
ServerModSetup("2798599672")
-- Show Me(中文)
ServerModSetup("2287303119")
-- Global Positions
ServerModSetup("378160973")
-- 人物 黎明卿-波多尔多
ServerModSetup("2865408620")
-- 身在福中不知福
ServerModSetup("2543193992")
-- fast travel
ServerModSetup("2119742489")
```
方法中的数字是mod的id，在创意工坊页面url的参数中
![](http://oss.ryanamigo.com/blog/dst-2.jpg)
容器启动的时候会去下载这些mod

### 启用mod
启用mod的方式比较麻烦，需要写每个mod的配置,文件有两个，
DoNotStarveTogether/DoNotStarveTogether/Cluster_1/Master/modoverrides.lua (地面世界)
DoNotStarveTogether/DoNotStarveTogether/Cluster_1/Caves/modoverrides.lua (洞穴世界)

他们的大致结构是这样的
```lua
retrurn {
  ["workshop-1185229307"]={
    configuration_options={
      -- 这里是mod自己的配置，每个mod都不同
    },
    enabled=true  -- 这里启用了mod
  },
  ["workshop-1595631294"]={
    configuration_options={
      -- 这里是mod自己的配置，每个mod都不同
    },
    enabled=true  -- 这里启用了mod
  }, 
}
```
其中 configuration_options中的配置我们是不知道的。
比较方便的做法是把mod在自己的电脑上启动，用自己的电脑开服找到上面的两个文件（windows系统的路径在 `文档/Klei/...`中，稍微找一下就找到了），复制内容，粘贴到服务器上。

两个都配置完成后，需要重启容器
```shell
# 使用docker ps查看容器id, 也就是CONTAINER ID下面的
docker ps 

# 重启容器
docker restart 79ee0986e0ed
```
启动时可以查看启动日志，`docker logs 79ee0986e0ed --tail 50 -f`，要关闭日志，使用`Ctrl C`即可


## 附录

### 配置
饥荒基本配置，cluster.ini文件的所有配置项
[GAMEPLAY]
- game_mode（游戏模式）

  默认值： survival（生存）。

  只有 survival（生存）、 endless（无尽） 、wilderness（荒野）这3种游戏模式。

- max_players（最大人数）

  默认值：16。

  服务器内玩家同时在线的最大人数。

- pvp（ pvp 模式）

  默认值：false。

  pvp 模式下，玩家可以互相伤害。

- pause_when_empty

  默认值：true。

  服务器内没有玩家在线时，暂停服务器。


[NETWORK]
- lan_only_cluster（局域网游戏）

  默认值：false。

  只允许同一个局域网中的玩家加入。

- cluster_intention（游戏风格）

  默认值：无。

  只有 cooperative（合作）、 competitive（竞争）、social（社交）、madness（疯狂）这4种游戏风格，对游戏无任何影响。

- cluster_password（服务器密码）

  默认值：空。

  服务器密码为空时，玩家加入不需要输入密码，否则需要输入密码。

- cluster_description（服务器描述）

  默认值：空。

  服务器的描述。

- cluster_name（服务器名）

  默认值：无。

  服务器的名字。

- offline_cluster（离线）

  默认值：false。

  创建一个离线服务器，该服务器不会公开。只有本地网络上的玩家才能加入，任何与 Steam 相关的功能都将无法使用。
- cluster_language（服务器语言）

  默认值：无。

  服务器内显示的语言。

- whitelist_slots（白名单席位）

  默认值：0。

  为白名单玩家预留的空位，只有白名单玩家才能加入。

[MISC]
- console_enabled（启用控制台）

  默认值：true。

  允许玩家在控制台中输入命令。

[SHARD]

- shard_enabled（启用共享）

默认值：false。

启用服务器共享。对于多层世界，值必须是 true。对于单层世界，值可以省略。

- bind_ip

默认值：127.0.0.1。

这是 主世界 将侦听其他 从世界 连接到的网络地址。如果所有服务器都在同一台机器上，则将此设置为 127.0.0.1，如果服务器在不同的机器上，则将其设置为 0.0.0.0。

- master_ip（主 ip）

默认值：无。

从世界 在尝试连接到 主世界 时将使用的 IP 地址。如果所有服务器都在同一台机器上，请将其设置为 127.0.0.1。如果所有服务器不在同一台机器上，请将其设置为 运行主世界的那台机器的公网 ip。

- master_port（主端口）

默认值：10888。

这是 主世界 将侦听的 UDP 端口，从世界 在尝试连接到 主世界 时将使用该端口。所有的机器上的 master_port 必须保持一致，而且不能和同一台机器上的 server_port 相同。

- cluster_key（服务器认证密码）

默认值：无。

主世界 验证 从世界 的密码。如果所有世界都在同一台机器上，则只需要设置一次。所有的世界运行在不同的机器上，值只能保持一致。



### 控制台命令

`c_give(“XX”, 10)`  --——直接把10个xx放包里
`c_spawn(“XX”，10)` ——把10个xx放鼠标指针指示的地上
`TheInput:GetWorldEntityUnderMouse():Remove()` 删除鼠标指着的物品


## 物品代码

### 材料
cutgrass 草

twigs 树枝

log 木头

charcoal 木炭

ash 灰

cutreeds 采下的芦苇

lightbulb 荧光果

petals 花瓣

petals_evil 噩梦花瓣

pinecone 松果

foliage 叶子

cutlichen 摘下的苔藓

wormlight 虫子果

lureplantbulb 食人花种子

flint 燧石

nitre 硝石

redgem 红宝石

bluegem 蓝宝石

purplegem 紫宝石

greengem 绿宝石

orangegem 橙宝石

yellowgem 黄宝石

rocks 岩石

goldnugget 黄金

thulecite 铥矿石

thulecite_pieces 铥矿碎片

rope 绳子

boards 木板

cutstone 石砖

papyrus 纸

houndstooth 犬牙

pigskin 猪皮

manrabbit_tail 兔人尾巴

silk 蜘蛛丝

spidergland 蜘蛛腺体

spidereggsack 蜘蛛卵

beardhair 胡子

beefalowool 牛毛

honeycomb 蜂巢

stinger 蜂刺

walrus_tusk 海象牙

feather_crow 乌鸦羽毛

feather_robin 红雀羽毛

feather_robin_winter 雪雀羽毛

horn 牛角

tentaclespots 触手皮

trunk_summer 夏象鼻

trunk_winter 冬象鼻

slurtleslime 蜗牛龟粘液

slurtle_shellpieces 蜗牛龟壳片

butterflywings 蝴蝶翅膀

mosquitosack 蚊子血囊

slurper_pelt 啜食者皮

### 工具/武器

minotaurhorn 远古守护者角

deerclops_eyeball 巨鹿眼球

lightninggoathorn 闪电羊角

glommerwings 格罗门翅膀

glommerflower 格罗门花

glommerfuel 格罗门燃料

livinglog 活木头

nightmarefuel 噩梦燃料

gears 齿轮

transistor 晶体管

marble 大理石

boneshard 硬骨头

ice 冰

poop 便便

guano 鸟粪

dragon_scales 蜻蜓鳞片

goose_feather 鹿鸭羽毛

coontail 浣熊尾巴

bearger_fur 熊皮

axe 斧子

goldenaxe 黄金斧头

lucy 露西斧子

hammer 锤子

pickaxe 镐

goldenpickaxe 黄金镐

shovel 铲子

goldenshovel 黄金铲子

pitchfork 草叉

razor 剃刀

bugnet 捕虫网

fishingrod 鱼竿

multitool_axe_pickaxe 多功能工具

cane 行走手杖

trap 陷阱

birdtrap 鸟陷阱

trap_teeth 牙齿陷阱

trap_teeth_maxwell 麦斯威尔的牙齿陷阱

backpack 背包

piggyback 猪皮包

krampus_sack 坎普斯背包

umbrella 雨伞

grass_umbrella 草伞

heatrock 保温石

bedroll_straw 草席卷

bedroll_furry 毛皮铺盖

torch 火炬

lantern 提灯

pumpkin_lantern 南瓜灯

compass 指南针

fertilizer 化肥

firesuppressor 灭火器

sewing_kit 缝纫工具包

spear 矛

boomerang 回旋镖

tentaclespike 狼牙棒

blowdart_pipe 吹箭

blowdart_sleep 麻醉吹箭

blowdart_fire 燃烧吹箭

hambat 火腿短棍

nightsword 暗影剑

batbat 蝙蝠棒

ruins_bat 远古短棒

spear_wathgrithr 瓦丝格雷斯矛

panflute 排箫

onemanband 独奏乐器

gunpowder 火药

beemine 蜜蜂地雷

bell 铃

amulet 红色护身符

blueamulet 蓝色护身符

purpleamulet 紫色护身符

yellowamulet 黄色护身符

orangeamulet 橙色护身符

greenamulet 绿色护身符

nightmare_timepiece 铥矿奖章

icestaff 冰魔杖

firestaff 火魔杖

telestaff 传送魔杖

orangestaff 橙色魔杖

### 装备

strawhat 草帽

flowerhat 花环

greenstaff 绿色魔杖

yellowstaff 黄色魔杖

diviningrod 探矿杖

book_birds 召唤鸟的书

book_tentacles 召唤触手的书

book_gardening 催生植物的书

book_sleep 催眠的书

book_brimstone 召唤闪电的书

waxwelljournal 麦斯威尔的日志

abigail_flower 阿比盖尔之花

balloons_empty 空气球

balloon 气球

lighter 薇洛的打火机

chester_eyebone 切斯特骨眼

featherfan 羽毛扇

staff_tornado 龙卷风魔杖

nightstick 夜棍

beefalohat 牛毛帽

featherhat 羽毛帽

footballhat 猪皮帽

tophat 高礼帽

earmuffshat 兔耳罩

winterhat 冬帽

minerhat 矿工帽

spiderhat 蜘蛛帽

beehat 蜂帽

walrushat 海象帽

slurtlehat 蜗牛帽子

bushhat 丛林帽

ruinshat 远古王冠

rainhat 防雨帽

icehat 冰帽

watermelonhat 西瓜帽

catcoonhat 浣熊帽

wathgrithrhat 瓦丝格雷斯帽

armorwood 木盔甲

### 建筑

campfire 营火

firepit 石头营火

armorgrass 草盔甲

armormarble 大理石盔甲

armor_sanity 夜魔盔甲

armorsnurtleshell 蜗牛龟盔甲

armorruins 远古盔甲

sweatervest 小巧背心

trunkvest_summer 夏日背心

trunkvest_winter 寒冬背心

armorslurper 饥饿腰带

raincoat 雨衣

webberskull 韦伯头骨

molehat 鼹鼠帽

armordragonfly 蜻蜓盔甲

beargervest 熊背心

eyebrellahat 眼睛帽

reflectivevest 反射背心

hawaiianshirt 夏威夷衬衫

coldfire 冷火

coldfirepit 石头冷火

cookpot 锅

icebox 冰箱

winterometer 寒冰温度计

rainometer 雨量计

slow_farmplot 一般农田

fast_farmplot 高级农田

siestahut 午睡小屋

tent 帐篷

homesign 路牌

birdcage 鸟笼

meatrack 晾肉架

lightning_rod 避雷针

pottedfern 盆栽

nightlight 暗夜照明灯

nightmarelight 影灯

researchlab 科学机器

researchlab2 炼金术引擎

researchlab3 阴影操纵者

researchlab4 灵子分解器

treasurechest 木箱

skullchest 骷髅箱

pandoraschest 华丽的箱子

minotaurchest 大华丽的箱子

wall_hay_item 草墙

wall_wood_item 木墙

wall_stone_item 石墙

wall_ruins_item 铥墙

wall_hay 地上的草墙

wall_wood 地上的木墙

wall_stone 地上的石墙

wall_ruins 地上的铥墙

pighouse 猪房

rabbithole 兔房

mermhouse 鱼人房

resurrectionstatue 肉块雕像

resurrectionstone 重生石

ancient_altar 远古祭坛

ancient_altar_broken 损坏的远古祭坛

telebase 传送核心

gemsocket 宝石看台

eyeturret 固定在地上的眼睛炮塔

eyeturret_item 可带走的眼睛炮塔

cave_exit 洞穴出口

turf_woodfloor 木地板

turf_carpetfloor 地毯地板

turf_checkerfloor 棋盘地板

adventure_portal 冒险之门

rock_light 火山坑

gravestone 墓碑

mound 坟墓土堆

skeleton 人骨

houndbone 狗骨头

animal_track 动物足迹

dirtpile 可疑的土堆

pond 池塘

pond_cave 洞穴池塘

pighead 猪头棍

mermhead 鱼头棍

pigtorch 猪火炬

rabbithole 兔子洞

beebox 蜂箱

beehive 野生蜂窝

wasphive 杀人蜂窝

spiderhole 洞穴蜘蛛洞

walrus_camp 海象窝

tallbirdnest 高鸟窝

houndmound 猎犬丘

slurtlehole 蜗牛窝

batcave 蝙蝠洞

monkeybarrel 猴子桶

spiderden 蜘蛛巢穴

molehill 鼹鼠丘

catcoonden 浣熊洞

rock1 带硝石的岩石

rock2 带黄金的岩石

rock_flintless 只有石头的岩石

stalagmite_full 大圆洞穴石头

stalagmite_med 中圆洞穴石头

stalagmite_low 小圆洞穴石头

stalagmite_tall_full 大高洞穴石头

stalagmite_tall_med 中高洞穴石头

stalagmite_tall_low 小高洞穴石头

rock_ice 冰石

ruins_statue_head 远古头像

ruins_statue_mage 远古法师雕像

marblepillar 大理石柱子

marbletree 大理石树

statueharp 竖琴雕像

basalt 玄武岩

basalt_pillar 高玄武岩

insanityrock 猪王矮柱石

sanityrock 猪王高柱石

ruins_chair 远古椅子

ruins_vase 远古花瓶

ruins_table 远古桌子

statuemaxwell 麦斯威尔雕像

statueglommer 格罗门雕像

relic 废墟

ruins_rubble 损毁的废墟

bishop_nightmare 损坏的雕像

rook_nightmare 损坏的战车

knight_nightmare 损坏的骑士

chessjunk1 损坏的机械1

chessjunk2 损坏的机械2

### 食物

carrot 胡萝卜

chessjunk3 损坏的机械3

teleportato_ring 环状传送机零件

teleportato_box 盒状传送机零件

teleportato_crank 曲柄状传送机零件

teleportato_potato 球状传送机零件

teleportato_base 传送机零件底座

teleportato_checkmate 传送机零件底座

wormhole 虫洞

wormhole_limited_1 被限制的虫洞

stafflight 小星星

treasurechest_trap 箱子陷阱

icepack 冰包

dragonflychest 蜻蜓箱子

carrot_cooked 熟胡萝卜

cookedmonstermeat 熟疯肉

monstermeat_dried 干疯肉

plantmeat 食人花肉

plantmeat_cooked 熟食人花肉

honey 蜂蜜

butter 黄油

butterflymuffin 奶油松饼

frogglebunwich 青蛙圆面包三明

bird_egg 鸡蛋

bird_egg_cooked 煮熟的鸡蛋

rottenegg 烂鸡蛋

tallbirdegg 高鸟蛋

tallbirdegg_cooked 熟高鸟蛋

tallbirdegg_cracked 孵化的高鸟蛋

fish 鱼

fish_cooked 熟鱼

eel 鳗鱼

eel_cooked 熟鳗鱼

froglegs 蛙腿

froglegs_cooked 熟蛙腿

batwing 蝙蝠翅膀

batwing_cooked 熟蝙蝠翅膀

trunk_cooked 熟象鼻

mandrake 曼德拉草

cookedmandrake 熟曼特拉草

honeyham 蜜汁火腿

dragonpie 龙馅饼

taffy 太妃糖

pumpkincookie 南瓜饼

kabobs 肉串

powcake 芝士蛋糕

mandrakesoup 曼德拉草汤

baconeggs 鸡蛋火腿

bonestew 肉汤

perogies 半圆小酥饼

wetgoop 湿腻焦糊

ratatouille 蹩脚的炖菜

fruitmedley 水果拼盘

fishtacos 玉米饼包炸鱼

waffles 华夫饼

turkeydinner 火鸡正餐

fishsticks 鱼肉条

stuffedeggplant 香酥茄盒

honeynuggets 甜蜜金砖

meatballs 肉丸

jammypreserves 果酱蜜饯

monsterlasagna 怪物千层饼

unagi 鳗鱼料理

bandage 蜂蜜绷带

healingsalve 治疗药膏


carrot 胡萝卜

chessjunk3 损坏的机械3

teleportato_ring 环状传送机零件

teleportato_box 盒状传送机零件

teleportato_crank 曲柄状传送机零件

teleportato_potato 球状传送机零件

teleportato_base 传送机零件底座

teleportato_checkmate 传送机零件底座

wormhole 虫洞

wormhole_limited_1 被限制的虫洞

stafflight 小星星

treasurechest_trap 箱子陷阱

icepack 冰包

dragonflychest 蜻蜓箱子

carrot_cooked 熟胡萝卜

cave_banana_tree 洞穴香蕉树

mushtree_small 小蘑菇树

livingtree 活树

deciduoustree 橡树

deciduoustree_tall 高橡树

deciduoustree_short 矮橡树

red_mushroom 红蘑菇

green_mushroom 绿蘑菇

blue_mushroom 蓝蘑菇

mushtree_tall 高蘑菇树

mushtree_medium 中蘑菇树

### 植物

flower 花

flower_evil 噩梦花

carrot_planted 长在地上的胡萝卜

grass 长在地上的草

depleted_grass 草根

dug_grass 长草簇

sapling 树苗

dug_sapling 可种的树苗

berrybush 果树丛

dug_berrybush 可种的果树丛

spoiled_food 腐烂食物

flowersalad 花沙拉

icecream 冰激淋

watermelonicle 西瓜冰

trailmix 干果

hotchili 咖喱

guacamole 鳄梨酱

goatmilk 羊奶

berrybush2 果树丛2

dug_berrybush2 可种的果树丛2

marsh_bush 尖刺灌木

dug_marsh_bush 可种的尖刺灌木

reeds 芦苇

lichen 洞穴苔藓

cave_fern 蕨类植物

evergreen 树

evergreen_sparse 无松果的树

marsh_tree 针叶树

marbletree 大理石树

statueharp 竖琴雕像

basalt 玄武岩

basalt_pillar 高玄武岩

insanityrock 猪王矮柱石

sanityrock 猪王高柱石

ruins_chair 远古椅子

ruins_vase 远古花瓶

ruins_table 远古桌子

statuemaxwell 麦斯威尔雕像

statueglommer 格罗门雕像

relic 废墟

ruins_rubble 损毁的废墟

bishop_nightmare 损坏的雕像

rook_nightmare 损坏的战车

knight_nightmare 损坏的骑士

chessjunk1 损坏的机械1

chessjunk2 损坏的机械2


### 动物

rabbit 兔子

perd 火鸡

crow 乌鸦

robin 红雀

robin_winter 雪雀

butterfly 蝴蝶

fireflies 萤火虫

bee 蜜蜂

killerbee 杀人蜂

flower_cave 单朵洞穴花

flower_cave_double 双朵洞穴花

flower_cave_triple 三朵洞穴花

tumbleweed 滚草

cactus 仙人掌

cactus_flower 仙人掌花

marsh_plant 水塘边小草

pond_algae 水藻

flies 苍蝇

mosquito 蚊子

frog 青蛙

beefalo 牛

babybeefalo 小牛

lightninggoat 闪电羊

pigman 猪人

pigguard 猪守卫

bunnyman 兔人

merm 鱼人

spider_hider 洞穴蜘蛛

spider_spitter 喷射蜘蛛

spider 地面小蜘蛛

spider_warrior 地面绿蜘蛛

spiderqueen 蜘蛛女王

spider_dropper 白蜘蛛

hound 猎狗

firehound 红色猎狗

icehound 冰狗

tentacle 触手

tentacle_garden 巨型触手

leif 树精

leif_sparse 稀有树精

walrus 海象

little_walrus 小海象

smallbird 小高鸟

teenbird 青年高鸟

tallbird 高鸟

worm 远古虫子

abigail 阿比盖尔

ghost 幽灵

koalefant_summer 夏象

koalefant_winter 冬象

penguin 企鹅

slurtle 蜗牛龟

snurtle 黏糊虫

bat 蝙蝠

rocky 龙虾

monkey 猴子

slurper 缀食者

buzzard 秃鹫

mole 鼹鼠

catcoon 浣熊

knight 发条骑士

bishop 主教

rook 战车

crawlinghorror 爬行暗影怪

terrorbeak 尖嘴暗影怪

deerclops 巨鹿

minotaur 远古守护者

shadowwaxwell 麦斯威尔黑影小人

krampus 坎普斯

glommer 格罗门

chester 切斯特

lureplant 食人花

eyeplant 食人花眼睛

bigfoot 大脚

pigking 猪王

moose 鹿鸭

mossling 小鸭

dragonfly 蜻蜓

warg 座狼

bearger 熊

birchnutdrake 坚果鸭

mooseegg 鹿鸭蛋
