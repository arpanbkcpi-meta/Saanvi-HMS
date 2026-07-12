const nodemailer = require("nodemailer"); //Import nodemailer module
const transporter = nodemailer.createTransport({
    //Its like creating a delivery Truck which will deliver the mail to the user
    service: "gmail", //We will use gmail to send the mail ,Think of it as "Which post office should i use?" could be Outlook , Yahoo , Company SMTP
    auth: { //Authentication of the email account from which we will send the mail
        //Gmail wont trust strangers so we must prove our identity.
        
        user: process.env.EMAIL_USER,//Email address of the sender
        //Who is sending the email? , not hardcoded , read it from .env

        pass: process.env.EMAIL_PASSWORD,//Password of the sender email address 
        //Whats the app password? Again not hardcoded , read from .env
}
});

const sendEmail = async({to,subject,html})=>{
    // I dont want every controller to know how email works, instead , they should simply say sendEmail(...), very similar to console.log(), axios.get(),res.json()
 //to "Who should receive this email?" Maybe patient@gmail.com , doctor@gmail.com
//subject , Email subject ,"Your appointment is confirmed" , "Your password has been reset"
//html ,  instead of the plain text , we can write beautiful emails
try{
    await transporter.sendMail({//"Okay Gmail, Deliver this."
        from: `"Saanvi HMS" <${process.env.EMAIL_USER}`,//Who send it
        to,
        subject,
        html
    });
    console.log(`✅ Email sent to ${to}`);//developer thinking everything worked , good for debugging
} catch(error){
     console.error('❌ Email failed to send:', error.message);
    // Deliberately NOT throwing — a failed email should never crash
    // or block the actual appointment/prescription/lab action itself
}

};

module.exports = sendEmail;//Developer thinking: "I bulit this useful tool, i want the rest of the application to be able to use it"

//Now any controller can simply do : 
//const sendEmail=require('../utils/sendEmail');
//and call
// await sendEmail({to:patient.email
// ,subject:"Appintment Approved"
// ,html:"<h1>Your appointment has been approved</h1>"
// }); 



