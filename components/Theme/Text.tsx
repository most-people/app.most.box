import { Text, type TextProps, StyleSheet } from 'react-native'

import { Colors } from '@/constants/Colors'
import { useUserStore } from '@/stores/userStore'

// Text
type ThemeProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'link' | 'hide'
}

const ThemeText = ({ style, type = 'default', ...rest }: ThemeProps) => {
  const theme = useUserStore((state) => state.theme)

  return (
    <Text
      style={[
        { color: Colors[theme].text },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'hide' ? styles.hide : undefined,
        style,
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  hide: {
    fontSize: 16,
    lineHeight: 24,
    color: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    cursor: 'pointer',
    lineHeight: 30,
    fontSize: 16,
    color: Colors.link,
  },
})
export default ThemeText
