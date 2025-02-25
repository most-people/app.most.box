import { ScrollViewStyleReset } from 'expo-router/html'
import { type PropsWithChildren } from 'react'

/**
 * 此文件仅用于Web环境，用于在静态渲染期间配置每个网页的根HTML。
 * 此函数的内容仅在Node.js环境中运行，无法访问DOM或浏览器API。
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* 在web端禁用body滚动。这使得ScrollView组件的行为更接近原生效果。然而，对移动端网页来说，body滚动通常是很好的功能。如果你想启用它，删除这行即可。 */}
        <ScrollViewStyleReset />

        {/* 使用原始 CSS 样式作为应急方案，确保在暗模式下背景色不会闪烁 */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* 在这里添加任何你想在 web 端全局可用的 <head> 元素... */}
      </head>
      <body>{children}</body>
    </html>
  )
}

const responsiveBackground = `body {background-color: rgb(21,23,24)}`
