
interface IBehaviorWithAuth {
	isPageAuth?: boolean;
	certifiedPagePath?: string;
}

const BehaviorWithAuth = (params?: IBehaviorWithAuth) => {
	const { isPageAuth, certifiedPagePath } = params ?? {}

	return Behavior({

		data: {
			token: wx.getStorageSync('token')
		},
		lifetimes: {
			created() {
				//@ts-ignore
				this._isCertified = this.isCertified 
			},
			attached() {
				if (isPageAuth && certifiedPagePath && !this.data.token) {
					wx.navigateTo({ url: certifiedPagePath })
				}
			},
		},
		definitionFilter(defFields: any) {
			console.log(defFields);
			console.log(this);

			const authMethods = defFields?.authMethods ?? []
			authMethods.forEach((item: string) => {
				if (defFields?.methods[item]) {
					defFields.methods[item] = () => {
						if (this.isCertified?.()) {
							defFields.methods[item]()
						}
					}
				}
			})
		},
		methods: {
			isCertified(isToCertifiedPage?: boolean) {
				if (isToCertifiedPage && certifiedPagePath && !this.data.token) {
					wx.navigateTo({ url: certifiedPagePath })
				}
				return !!this.data.token
			}
		}
	})
}

export default BehaviorWithAuth