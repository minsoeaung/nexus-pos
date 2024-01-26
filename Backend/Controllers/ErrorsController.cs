using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

public class ErrorsController : BaseApiController
{
    [Route("/error")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public ActionResult Error()
    {
        var exception = HttpContext.Features.Get<IExceptionHandlerFeature>()?.Error;
        return Problem(
            title: $"{exception?.Message ?? "Internal Server Error."}",
            statusCode: StatusCodes.Status500InternalServerError
        );
    }
}