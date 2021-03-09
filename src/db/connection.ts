import mongoose from 'mongoose';

const connect = async():Promise<boolean> => {
    try{
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await mongoose.connect(process.env.MONGO_URI!,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    return true
    } catch(err){
        console.log(err);
        return false;
    }
};

export default connect;