


export const updateUserLocation = async(req:Request, res:Response):Promise<Response> =>{
  try {
    const {userID} = req.params;
    

    const user = await userModel.findById(userID);

    if (user) {
      const location = await userModel.findByIdAndUpdate(userID,{
        address: "",
      },
      {new: true}
      );
      return res.status(HTTP.CREATED).json({
      message: 'user created successfully',
      data: location,
      status: HTTP.CREATED
    });
      sendEmail(user);
    } else {
      return res.status(HTTP.BAD).json({
      message: 'error getting user ',
      status: HTTP.BAD
    });
    }

    
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: 'error creating user',
      status: HTTP.BAD
    });
  }
};

