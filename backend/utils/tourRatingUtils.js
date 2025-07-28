import Tour from '../models/Tour.js' 
import Review from '../models/Review.js' 

/**
 * @function updateTourAverageRating
 * @description Calculates the average rating for a given tour and updates the Tour document.
 * @param {string} tourId - The ID of the tour to update.
 */
async function updateTourAverageRating(tourId) {
    try {
        // 1. Find all approved reviews for the given tourId
        const reviews = await Review.find({ tourId: tourId });

        console.log(reviews)
        if (reviews.length == 0) {
            // If no approved reviews, set rating to 0 or null, or handle as appropriate
            await Tour.findByIdAndUpdate(tourId, { rating: 0});
            console.log(`Tour ${tourId}: No approved reviews found. Rating set to 0.`);
            return;
        }

        // 2. Calculate the sum of ratings
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const numberOfReviews = reviews.length;

        // 3. Compute the average rating
        const averageRating = (totalRating / numberOfReviews).toFixed(1); // Keep one decimal place

        // 4. Update the Tour document
        const updatedTour = await Tour.findByIdAndUpdate(
            tourId,
            { rating: parseFloat(averageRating) },
            { new: true, runValidators: true } // Return updated doc, run schema validators
        );

        if (updatedTour) {
            console.log(`Successfully updated tour ${tourId} with average rating: ${averageRating} (${numberOfReviews} reviews)`);
        } else {
            console.warn(`Tour with ID ${tourId} not found for rating update.`);
        }

    } catch (error) {
        console.error(`Error updating average rating for tour ${tourId}:`, error);
    }
}

export default updateTourAverageRating;