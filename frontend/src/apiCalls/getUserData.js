import axios from 'axios'
import urls from '../utils/urls'

const getUserData = async (phoneNumber, setUser) => {
  const timezoneOffset = new Date().getTimezoneOffset()

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
