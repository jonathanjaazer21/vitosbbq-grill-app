import { Clock, Pen } from './styles'
export const GRILL_RESERVATION = 'Grill Reservation'
export const PAYMENT_TRANSACTION = 'Payment Transaction'
export const USER_MASTERFILE = 'User Masterfile'
export const BRANCH_MASTERFILE = 'Branch Masterfile'
export const DASHBOARD = 'Dashboard'
export const MASTER_DATA = 'Master Data'
export const DROPDOWN_MASTERFILE = 'Dropdown Masterfile'

export default [
  {
    title: DASHBOARD,
    Icon: ({ isToggled }) => <Clock isToggled={isToggled} />,
    active: true,
    subMenu: [
      {
        title: GRILL_RESERVATION,
        active: true,
        path: '/dashboard/grillReservation'
      },
      {
        title: PAYMENT_TRANSACTION,
        active: false,
        path: '/dashboard/paymentTransaction'
      }
    ]
  },
  {
    title: MASTER_DATA,
    Icon: ({ isToggled }) => <Pen isToggled={isToggled} />,
    active: false,
    subMenu: [
      {
        title: USER_MASTERFILE,
        active: false,
        path: '/masterData/userMasterFile'
      },
      {
        title: BRANCH_MASTERFILE,
        active: false,
        path: '/masterData/branchMasterFile'
      },
      {
        title: DROPDOWN_MASTERFILE,
        active: false,
        path: '/masterData/dropdownMasterfile'
      }
    ]
  }
]
