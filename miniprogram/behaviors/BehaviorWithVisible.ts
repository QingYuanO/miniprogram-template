
type CallbackType = () => void
const BehaviorWithVisible = (prefix: string) => {
	const visibleStr = `${prefix}Visible`
	return Behavior({
		data: {
			[visibleStr]: false
		},
		methods: {
			[`${prefix}Toggle`](callback?: CallbackType) {
				const visible = this.data[visibleStr]
				this.setData({
					[visibleStr]: !visible
				}, () => {
					callback?.()
				})
			},
			[`${prefix}Show`](callback?: CallbackType) {
				this.setData({
					[visibleStr]: true
				}, () => {
					callback?.()
				})
			},
			[`${prefix}Hide`](callback?: CallbackType) {
				this.setData({
					[visibleStr]: false
				}, () => {
					callback?.()
				})
			}
		}
	})
}

export default BehaviorWithVisible