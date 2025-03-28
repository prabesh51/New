import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "ap-southeast-2_HbrVRrgD6", // Replace with your actual User Pool ID
  ClientId: "4b4n5dndo9mvj2t7vg20bbcbj5",   // Replace with your SPA Client ID (no secret)
};

const userPool = new CognitoUserPool(poolData);

export { poolData, userPool };