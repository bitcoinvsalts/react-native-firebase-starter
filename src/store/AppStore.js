import { observable, autorun } from 'mobx'
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge'

class AppStore {
  @observable username = ''
  @observable user = {}
  @observable post_count = 0
  @observable order_count = 0
  @observable chat_count = 0
  @observable new_messages = 0
  @observable current_page = ''
  @observable current_puid = ''
  @observable tracker = new GoogleAnalyticsTracker('UA-xxxx-x')
  @observable onesignal_app_id = "f4332f39-a1b7-4bdc-b55b-8f7f03fee87d"
  @observable onesignal_api_key = "Basic MzUzN2UwYjQtZDkxZC00OTVmLTg3NWItYmYxNTNmNjk2NmI4"
}

const appStore = new AppStore()

/*
autorun(() => {
  console.log(appStore)
})
*/

export default appStore
