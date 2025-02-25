import PageView from '@/components/PageView'
import { ThemeText } from '@/components/Theme'
import React from 'react'
import { Linking } from 'react-native'

const AboutPaperPage = () => {
  const handleLinkPress = (url: string) => {
    Linking.openURL(url)
  }

  return (
    <PageView title="IPFS + Filecoin + Fastify + Dot.most.box + Smart Contracts = Fully DApp">
      <ThemeText type="subtitle">
        论如何利用 IPFS+Filiecoin+Dot.most.box+以太坊智能合约构建完全不需要后端的去中心化应用
      </ThemeText>
      <ThemeText>作者：most.box</ThemeText>
      <ThemeText>标题很长，为了跟大家讲清楚，需要了解一定基础知识，若你已经了解，请跳过</ThemeText>

      <ThemeText>目录</ThemeText>
      {[
        '去中心化 密码朋克',
        'IPFS',
        'Filecoin',
        'Dot.most.box',
        '我们需要你一起添砖加瓦',
        'Fleek 前端部署',
        'Dot.most.box 节点部署',
        'IPFS 节点部署',
        '以太坊智能合约更新节点',
      ].map((item, index) => (
        <ThemeText key={index}>{`${index + 1}. ${item}`}</ThemeText>
      ))}

      <ThemeText type="subtitle">去中心化</ThemeText>
      <ThemeText>
        通俗地讲，就是每个人都是中心，每个人都可以连接并影响其他节点，这种扁平化、开源化、平等化的现象或结构。
      </ThemeText>
      <ThemeText>
        去中心化代表的是言论自由，信息公开透明，保护个人隐私。你可以不相信任何个人或组织，但你可以永远相信数学。
      </ThemeText>
      <ThemeText>因为不论在任何宇宙，任何表达方式，同等条件数学结果都是恒定不变的。</ThemeText>

      <ThemeText type="subtitle">密码朋克</ThemeText>
      <ThemeText>
        热衷于使用加密技术保护隐私的人们，他们相信通过技术而不是法律，才能真正保障个人信息的安全和自由。
      </ThemeText>
      <ThemeText>最简单的例子就是中本聪，他无人不知无人不晓，却也无人知晓他是谁。</ThemeText>

      <ThemeText type="subtitle">IPFS</ThemeText>
      <ThemeText>先观察并打开这两个链接</ThemeText>
      <ThemeText
        type="link"
        onPress={() =>
          handleLinkPress(
            'https://bafkreiaadupp3gal2nofg67vq67o4cbzl2ds34fnmlgjr7rdkxzg5upwxq.ipfs.dweb.link',
          )
        }
      >
        https://bafkreiaadupp3gal2nofg67vq67o4cbzl2ds34fnmlgjr7rdkxzg5upwxq.ipfs.dweb.link
      </ThemeText>
      <ThemeText
        type="link"
        onPress={() =>
          handleLinkPress(
            'https://bafkreiaadupp3gal2nofg67vq67o4cbzl2ds34fnmlgjr7rdkxzg5upwxq.ipfs.flk-ipfs.xyz',
          )
        }
      >
        https://bafkreiaadupp3gal2nofg67vq67o4cbzl2ds34fnmlgjr7rdkxzg5upwxq.ipfs.flk-ipfs.xyz
      </ThemeText>
      <ThemeText>IPFS 全称（InterPlanetary File System）中文（星际文件系统）</ThemeText>
      <ThemeText>我们可以把任意文件（如图片、视频、网站…）想象成一本书。</ThemeText>
      <ThemeText>把 IPFS 想象成一座图书馆。</ThemeText>
      <ThemeText>
        当我们把书在自己的图书馆后，当其它人得知你有这本书，就会把书复制一份带回自己的图书馆。
      </ThemeText>
      <ThemeText>
        如果大家都喜欢这本书，越来越多的人把这本书带会自己的图书馆，那么世界各地都会有这本书，你之前可能要去国外才能读到的书，现在只需要去一趟镇上就能拿到。
      </ThemeText>
      <ThemeText>IPFS 网络负责告诉离你最近的书在哪里。</ThemeText>
      <ThemeText>
        IPFS 每个文件有一个 CID 就是文件的身份证号，上文中
        bafkreiaadupp3gal2nofg67vq67o4cbzl2ds34fnmlgjr7rdkxzg5upwxq 就是这个文件的
        CID，它的容量很大，大到足以给地球上的每一粒沙子发身份证号。
      </ThemeText>
      <ThemeText type="subtitle">Filecoin</ThemeText>
      <ThemeText>由于很少有人愿意无偿开设图书馆，于是出现了 IPFS 的激励层 Filecoin。</ThemeText>
      <ThemeText>
        Filecoin
        让开设图书馆变得有利可图，当你想发表自己的书，又担心没有图书馆愿意收藏，最简单的办法就是花钱，当你在
        Filcoin
        网络中喊一嗓子就有无数的图书馆馆长跳出来说他愿意帮你储存，你选一家最便宜的，只需要一笔很小的费用，而且这个馆长很心黑，别人从他这里借书也要收手续费，其他黑心馆长为了赚这个钱，纷纷保存这本书，供大家借阅。而由于馆长的增多，市场化的竞争只会让手续费越来越低。
      </ThemeText>
      <ThemeText type="subtitle">Dot.most.box</ThemeText>
      <ThemeText>
        想象一下每个人都有无数张画板，当你每画一笔，别人的画板上会立刻出现这一笔，同理别人画的每一笔也会出现的你的画板上。
      </ThemeText>
      <ThemeText>这样你只需要和朋友约定好用那张画板，就可以一起聊天了。</ThemeText>
      <ThemeText>你也可以自己搞创作，设置只能有你能画，别人只能看的画板。</ThemeText>
      <ThemeText>
        Dot.most.box
        就是帮大家立刻同步这一切的工具，有了它，一起吹牛、玩游戏、写文档、开会通通不再是问题😎
      </ThemeText>
      <ThemeText>不过任何事物都不是凭空得来的，如果免费那么肯定有人帮你承担了成本，</ThemeText>
      <ThemeText>回到最初那两个 IPFS 网址，为什么结尾</ThemeText>
      <ThemeText>.ipfs.flk-ipfs.xyz</ThemeText>
      <ThemeText>.ipfs.dweb.link</ThemeText>
      <ThemeText>不一样，他们代表什么？</ThemeText>
      <ThemeText>
        他们其实就是公共图书馆（IPFS
        公共节点），当你请求文件他会去看自己有没有，没有就去其他图书馆取来给你。之所以称为公共因为他通过
        http
        协议发给你，这种协议是给传统中心化服务器用的，你必然无法分享，也无法付费，所以公共节点是真正大公无私的共产主义者。
      </ThemeText>
      <ThemeText>你愿意花时间来部署一个公共节点吗？</ThemeText>
      <ThemeText>如果愿意的话，可以接着往下看。</ThemeText>
      <ThemeText type="subtitle">Fleek 前端部署</ThemeText>
      <ThemeText>代码部分，暂时跳过</ThemeText>
      <ThemeText type="subtitle">IPFS 节点部署</ThemeText>
      <ThemeText>代码部分，暂时跳过</ThemeText>
      <ThemeText type="subtitle">Dot.most.box 节点部署</ThemeText>
      <ThemeText>代码部分，暂时跳过</ThemeText>
      <ThemeText type="subtitle">以太坊智能合约更新节点</ThemeText>
      <ThemeText>为什么要用到以太坊？</ThemeText>
      <ThemeText>由于去中心化的应用还很少</ThemeText>
      <ThemeText>以太坊的节点很多，所以我们将最后的救命稻草交给区块链</ThemeText>
      <ThemeText>
        假设所有的 IPFS 和 Dot.most.box
        节点都由于种种原因离线，那我们将无法访问，某些节点可以启动他的备份系统，来部署新的节点并通过智能合约推送到以太坊公链上。
      </ThemeText>
      <ThemeText>这样所有客户端刷新去链上查询，就可以重新恢复访问了。</ThemeText>
      <ThemeText>
        最好的方式当然是像 Filecoin 一样，给 Dot.most.box
        也设计激励层，这样就可以实现去中心化网络的生生不息。
      </ThemeText>
      <ThemeText>
        至此人类真正实现言论自由的时代即将到来，我们可以放心大胆地将黑暗和不公通过匿名的方式发表出来，让一切丑恶暴露在阳光下，让问题暴露出来是解决问题的第一步，为我们光明的未来干杯！
      </ThemeText>
      <ThemeText type="subtitle">附录</ThemeText>
      <ThemeText>域名的去中心化 .box</ThemeText>
      <ThemeText>目前只有这个域名是通过加密货币直接购买的去中心化域名</ThemeText>
      <ThemeText>用户 加密钱包</ThemeText>
      <ThemeText>域名 .box</ThemeText>
      <ThemeText>网站 IPFS</ThemeText>
      <ThemeText>数据库 Dot.most.box</ThemeText>
      <ThemeText>智能合约 ETH</ThemeText>
      <ThemeText>以上是 most.box 的全部架构</ThemeText>
      <ThemeText>⅔ MOST.BOX</ThemeText>
      <ThemeText>最新文章收录在 most.box/about</ThemeText>
      <ThemeText>2025 年 2 月 5 日</ThemeText>
    </PageView>
  )
}

export default AboutPaperPage
