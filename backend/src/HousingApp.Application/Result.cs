using HousingApp.Domain;
using HousingApp.Domain.Error;

namespace HousingApp.Application
{
    public class Result<T>
    {
        public T? Value { get; private set; }
        public bool IsSuccess { get; private set; }
        public Error Error { get; private set; }

        private Result(T value)
        {
            IsSuccess = true;
            Value = value;
            Error = Error.None;
        }

        private Result(Error error)
        {
            Value = default;
            IsSuccess = false;
            Error = error;
        }

        public static Result<T> Success(T value) => new(value);
        public static Result<T> Failure(Error error) => new(error);
        //
        // public static implicit operator Result<T>(T value) => new(value);
        // public static implicit operator Result<T>(Error error) => new(error);
    }
}