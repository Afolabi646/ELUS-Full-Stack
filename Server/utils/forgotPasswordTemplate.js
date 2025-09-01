const forgotPasswordTemplate = ({ name, otp })=>{
    return `
    <div>
    <p>Dear, ${name}</p>
    <p>You requested for a password reset. Please use the OTP code to reset your password.</p>
    <div style = "background: yellow; color: blue; font-size: 20px; font-weight: 700; text-align:center">${otp}</div>
    <p>OTP valid for an hour. Enter this code on the ELUS website to proceed</p>
    <br/>
    <br/>
    <p>Thanks. <span style = "color: red">E</span><span style = "color: green">L</span><span style = "color: blue">U</span><span style = "color: yellow">S</span></p>
    </div>
    `;
}


export default forgotPasswordTemplate