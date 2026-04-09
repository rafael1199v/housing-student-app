using HousingApp.Domain.Error;

namespace HousingApp.Application;

public class Result<T>
{
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

    public T? Value { get; private set; }
    public bool IsSuccess { get; private set; }
    public Error Error { get; private set; }

    public static Result<T> Success(T value)
    {
        return new Result<T>(value);
    }

    public static Result<T> Failure(Error error)
    {
        return new Result<T>(error);
    }
    //
    // public static implicit operator Result<T>(T value) => new(value);
    // public static implicit operator Result<T>(Error error) => new(error);
}
