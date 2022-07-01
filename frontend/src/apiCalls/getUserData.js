import axios from 'axios'
import urls from '../utils/urls'

const getUserData = async (setUser) => {
  const timezoneOffset = new Date().getTimezoneOffset()
  const phoneNumber = JSON.parse(
    window.localStorage.getItem('USER_PHONE_NUMBER')
  )

  try {
    const res = await axios.post(
      urls.userData,
      {
        phoneNumber,
        timezoneOffset,
      },
      {
        baseURL: '/',
      }
    )

    if (res.data.status === 200) {
      let user = res.data.data
      console.log(user)
      setUser(user)
    }
  } catch (err) {
    console.log(err)
  }
}

export { getUserData }
