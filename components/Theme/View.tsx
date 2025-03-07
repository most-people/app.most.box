import { ViewProps, View } from 'react-native'

const ThemeView = ({ children, style, ...reset }: ViewProps) => {
  return (
    <View style={style} {...reset}>
      {children}
    </View>
  )
}

export default ThemeView
