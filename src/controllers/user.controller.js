import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from front-end ( post man)
  // validation - non empty
  // check if user already exists - username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in DB
  // check for user creation
  // remove password and refresh token filed from response
  // return response

  const { userName, email, fullName, password } = req.body;

  if (
    [userName, email, fullName, password].some((filed) => {
      filed?.trim() === "";
    })
  )
    throw new ApiError(400, "All fields are required");

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser)
    throw new ApiError(409, "User with email or username already is exists");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage ? req.files?.coverImage[0]?.path : '';

  if (!avatarLocalPath) throw new ApiError(409, "Avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(409, "Avatar file is required");

  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  // checking user is created in DB and selecting two fields
  const createdUser = await User.findById(user._id).select([
    "-password",
    "-refreshToken"
  ]
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Created user successfully"));
});

export { registerUser };
