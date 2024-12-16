import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js"

const AddNewComment = AsyncHandler(async (req, res) => {

    const { snippetId, message } = req.body;

    if (!snippetId || !message) {
        throw new ApiError(400, "All Fields are Required!");
    };

    const commentObject = await Comment.create({
        content: message,
        userId: req.user?._id,
        snippetId: snippetId
    });

    return res.status(201).json(
        new ApiResponse(201, commentObject, "Comment Added")
    )

});

export { AddNewComment };