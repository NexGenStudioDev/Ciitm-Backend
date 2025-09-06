import AdmissionUtils from '../Admission/Admission.utils.mjs';
import AlbumUtils from '../Album/Album.utils.mjs';
import Authentication from '../Auth/Auth.model.mjs';
import AuthUtils from '../Auth/Auth.utils.mjs';
import ContactUtils from '../Contact/Contact.utils.mjs';
import courseUtils from '../Course/course.utils.mjs';
import feeUtils from '../Fee/fee.utils.mjs';
import ImageUtils from '../Image/Image.utils.mjs';

// This function will handle the logic of fetching the dashboard data
let find_DashBoard_Data = async (io, socket) => {
  try {
    // Fetch the number of contacts
    let NUMBER_OF_CONTACT = await ContactUtils.FIND_NUMBER_OF_CONTACT();
    let NUMBER_OF_ADMISSION = await AdmissionUtils.FIND_NUMBER_OF_ADMISSION();
    let NUMBER_OF_COURSES = await courseUtils.TOTAL_NUMBER_OF_COURSES();
    let NUMBER_OF_IMAGE = await ImageUtils.NUMBER_OF_IMAGE();
    let NUMBER_OF_ALBUM = await AlbumUtils.NUMBER_OF_ALBUM();
    let Total_AMOUNT_PAID = await feeUtils.TOTAL_FEE_PAID();

    // Prepare the dashboard data
    let DashBoard_Data = [
      {
        name: 'Total Admission',
        value: NUMBER_OF_ADMISSION,
        icon: 'https://cdn4.iconfinder.com/data/icons/people-40/48/student_female-1024.png',
        color: '#FF5733',
      },
      {
        name: 'Total Earnings',
        value: '₹ ' + Total_AMOUNT_PAID,
        icon: 'https://www.pngmart.com/files/7/Earnings-PNG-Photos.png',
        color: '#FF5733',
      },
      {
        name: 'Total Courses',
        value: NUMBER_OF_COURSES,
        icon: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvectorified.com%2Fimages%2Fcourse-icon-34.png&f=1&nofb=1&ipt=5a1a58c96785649547fa817186e12b6e74dfb324618c0b02cdecb2a158175058',
        color: '#FF5733',
      },
      {
        name: 'Total Album',
        value: NUMBER_OF_ALBUM,
        icon: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F3460%2F3460808.png&f=1&nofb=1&ipt=57a64c43051df770fc4cbc0253ec4f617c0589d6ee131f4f7f219fbb330fdf40',
        color: '#FF5733',
      },
      {
        name: 'Total Image',
        value: NUMBER_OF_IMAGE,
        icon: 'http://icons.iconarchive.com/icons/designbolts/free-multimedia/1024/Photo-icon.png',
        color: '#FF5733',
      },
      {
        name: 'Total Contact',
        value: NUMBER_OF_CONTACT,
        icon: 'https://icon-library.com/images/contact-app-icon/contact-app-icon-12.jpg',
        color: '#FF5733',
      },
    ];

    // Emit the data back to the client that requested it
    io.emit('DashBoard_Data', {
      status: true,
      message: 'Data Found',
      DashBoard_Data,
    });
  } catch (error) {
    socket.emit('error', {
      message: error.message || 'Error fetching dashboard data',
    });
  }
};

// Socket event handler
let DashBoard_Socket = (io, socket) => {
  // Listen for the 'Request_DashBoard_Data' event from the client

  socket.on('Request_DashBoard_Data', async () => {
    await find_DashBoard_Data(io, socket); // Call the function to fetch data and send it back to the client
  });
};

export default DashBoard_Socket;
