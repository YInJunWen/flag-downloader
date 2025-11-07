export default {
  data() {
    return {
      scanData: '',
      isScanning: false,
      shiftPressed: false,
      keyBuffer: []
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
  },
  methods: {
    handleKeyDown(event) {
      // 阻止默认行为，避免不必要的页面滚动等
      event.preventDefault()
      
      // F12 开始扫码
      if (event.key === 'F12') {
        this.startScanning()
        return
      }
      
      // 记录 Shift 键状态
      if (event.key === 'Shift') {
        this.shiftPressed = true
        return
      }
      
      // 如果在扫码过程中
      if (this.isScanning) {
        // Enter 结束扫码
        if (event.key === 'Enter') {
          this.finishScanning()
          return
        }
        
        // 处理其他按键
        this.processScanKey(event)
      }
    },
    
    handleKeyUp(event) {
      if (event.key === 'Shift') {
        this.shiftPressed = false
      }
    },
    
    startScanning() {
      this.isScanning = true
      this.scanData = ''
      this.keyBuffer = []
      console.log('开始扫码...')
    },
    
    processScanKey(event) {
      const char = this.getCharacterFromKeyEvent(event)
      
      if (char) {
        this.keyBuffer.push(char)
        // 实时更新扫码数据（可选）
        this.scanData = this.keyBuffer.join('')
      }
    },
    
    getCharacterFromKeyEvent(event) {
      const key = event.key
      
      // 处理字母键（a-z）
      if (key >= 'a' && key <= 'z') {
        return this.shiftPressed ? key.toUpperCase() : key
      }
      
      // 处理字母键（A-Z） - 直接返回大写字母
      if (key >= 'A' && key <= 'Z') {
        return key
      }
      
      // 处理数字键
      if (key >= '0' && key <= '9') {
        // 如果按下 Shift，返回对应的符号
        if (this.shiftPressed) {
          const shiftNumberMap = {
            '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
            '6': '^', '7': '&', '8': '*', '9': '(', '0': ')'
          }
          return shiftNumberMap[key] || key
        }
        return key
      }
      
      // 处理其他可打印字符
      if (key.length === 1 && ![' ', 'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'Meta', 'F12'].includes(key)) {
        return key
      }
      
      return ''
    },
    
    finishScanning() {
      this.isScanning = false
      
      // 最终拼接所有字符
      const finalData = this.keyBuffer.join('')
      console.log('扫码完成:', finalData)
      
      // 触发业务逻辑
      this.$emit('scan-complete', finalData)
      
      // 重置状态
      this.scanData = ''
      this.keyBuffer = []
    }
  }
}
